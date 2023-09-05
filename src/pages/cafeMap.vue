<template>
  <div>
    <layout-header></layout-header>

    <q-card class="my-card">
      <div class="search-box">
        <h1 class="search-text">멤버 선택</h1>
        <select-box id="artist" v-model='artistList' v-bind='selectBoxOptions.artist' style="width: 100%;"
                    :multiplied='true'
                    use-chips/>
        <h1 class="search-text">기간 선택</h1>
        <com-period-date-picker v-model='archiveSchParams'
                                :clearable="true" :disabled='false' :readonly='false'
                                beginDeNm="schBeginDe" endDeNm="schEndDe"/>

        <div class="btn-box">
          <q-btn type="button" class="" @click="resetFunc"> 초기화 </q-btn>
          <q-btn type="button" class="search-btn" @click="searchBtnFunc"> 검색 </q-btn>
        </div>
      </div>

      <div class="list-order">
        <q-select class="order-select" v-model="orderData" :options="orderOptions"
                  @update:model-value="orderSelectChange()"
                  borderless style="width: 50%"></q-select>
      </div>

      <q-list v-if="archiveParams">
        <CafeItem v-for="archive in archiveParams" :archive="archive"
          @click="$q.screen.xs ? detailBtnFunc(archive._id) : onLoadMarker(archive)" />
      </q-list>

      <div v-if="paginationData.maxCnt" class="flex q-pa-lg flex-center">
        <q-pagination
            v-model="paginationData.current"
            :max="paginationData.maxCnt"
            @update:model-value="paginationChange()"
            direction-links
        />
      </div>
    </q-card>

    <naver-map v-if="!$q.screen.xs" style="width: 75%; height: 100vh; float: right;" :mapOptions="mapOptions" @onLoad="onLoadMap($event)">
      <span v-if="markerData" v-for="(marker) in markerData" v-bind:key="marker._id">
        <naver-marker
            @click="onLoadMarker(marker)"
            :latitude="marker.lat"
            :longitude="marker.lng"
        >
        </naver-marker>
      </span>

      <naver-info-window
          :marker="marker"
          :open="isOpen"
          @onLoad="onLoadInfoWindow($event)"
      >
        <div class="infowindow-style">
          <q-item class="archive-item">
            <q-item-section>
              <q-item-label class="archive-title">{{detailArchive.themeName}}</q-item-label>
              <q-item-label class="archive-account">{{detailArchive.organizer}}</q-item-label>
              <q-item-label class="archive-address">{{detailArchive.name}}</q-item-label>
              <q-item-label class="archive-address">{{detailArchive.address}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="infowindow-btn-box">
          <q-btn type="button" class="detail-btn" @click="detailBtnFunc(detailArchive._id)">상세보기</q-btn>
        </div>
      </naver-info-window>
    </naver-map>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, ref, watch} from 'vue';
import {NaverInfoWindow, NaverMap, NaverMarker} from 'vue3-naver-maps';
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import ccobject from '@/composables/createComObject';
import {useArtistStore} from '@/stores/artist';
import cscript from '@/composables/comScripts';
import {Archive, ArchiveSearchParams} from '@/types/Archive';
import {useArchiveStore} from '@/stores/archive';
import _ from 'lodash';
import {Pagination} from '@/types/CommonTypes';
import moment from 'moment';
import { useQuasar } from "quasar"
import CafeItem from '@/components/CafeItem.vue';

export default defineComponent({
  name      : 'cafeMap',
  components: { NaverMap, NaverMarker, NaverInfoWindow, CafeItem },
  mixins    : [mixinPageCommon],
  setup() {
    const $q = useQuasar();

    // 아티스트 멀티 셀렉트박스 배열 변수
    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    const archiveParams = ref({} as Archive);
    const detailArchive = ref({} as Archive);

    // 아티스트 멀티 셀렉트박스 배열 변수
    const artistList = ref([] as string[]);

    const map = ref();
    const markerData = ref({} as Archive);
    const mapOptions = {
      latitude          : 37.51747, // 지도 중앙 위도
      longitude         : 127.000022, // 지도 중앙 경도
      zoom              : 13,
      zoomControl       : false,
      zoomControlOptions: {position: 'TOP_RIGHT'},
    };

    const orderOptions = [{
      'label': '최신순',
      'value': 'newest',
    }, {
      'label': '오래된순',
      'value': 'oldest',
    }];

    const orderData = ref({
      'label': '최신순',
      'value': 'newest',
    });

    const paginationData = ref({
      current: 1,
      perPage: 2,
    } as Pagination);

    const marker = ref([] as unknown);
    const infoWindow = ref();
    const isOpen = ref(true); // false: 안보임, true: 보임
    let isEarly = true;

    const onLoadMarker = (markerObject: Archive) => {
      // 정보창 닫혀있으면 열기
      if(!cscript.$isEmpty(marker.value) && !isOpen.value){
        isOpen.value = _.cloneDeep(!isOpen.value);
      }

      const latlng = new naver.maps.LatLng(markerObject.lat, markerObject.lng);
      marker.value = new naver.maps.Marker({
        position : latlng,
        draggable: true,
      });

      // 카페 목록 상세 가져오기
      detailArchive.value = _.cloneDeep(markerObject);

      // 지도 중앙 좌표 변경
      if(!isEarly){
        map.value.setCenter(latlng);
      }
    };

    const onLoadInfoWindow = (infoWindowObject: unknown) => {
      infoWindow.value = infoWindowObject;

      // 카페 목록 생성 후 초기 정보창 데이터 생성 후 닫기
      // 초기 정보창 오픈 시 좌표가 맞지 않아서 때문에 추가
      if(isEarly){
        infoWindow.value.close();
        isEarly = false;
      }
    };

    const onLoadMap = (mapObject: unknown) => {
      map.value = mapObject;
    };

    const artistStore = useArtistStore();
    const archiveStore = useArchiveStore();

    onBeforeMount(() => {
      initialize();
    });


    const initialize = () => {
      // 임시 그룹 데이터
      const artistFilterData = {
        'flds': {
          'group': archiveStore.groupId,
        },
      };
      artistStore.getArtists(artistFilterData);
      getArchives();
    };

    watch(() => artistStore.artists, async () => {
      const artistList = JSON.parse(JSON.stringify(artistStore.artists));

      selectBoxOptions.value.artist = {
        name     : 'artistStatusOptions',
        clearable: true,
        style    : 'width: 250px',
      };
      selectBoxOptions.value.artist.data = await cscript.$getComboOptions(artistList);

      //초기값 셋팅
      archiveSchParams.value.artist = null;
    });

    watch(() => archiveStore.archives, async () => {
      // 카페 목록 초기화 및 검색 버튼 이후에 할당
      if (!cscript.$isEmpty(artistList.value)) {
        const archiveList = JSON.parse(JSON.stringify(archiveStore.archives));
        archiveParams.value = _.cloneDeep(archiveList);

        // 페이지네이션 설정
        paginationData.value.maxCnt = archiveStore.total / paginationData.value.perPage;

        if(!cscript.$isEmpty(archiveList)){
          // 지도 마커 생성
          markerData.value = _.cloneDeep(archiveList);

          // 마커 정보창 생성
          isEarly = true;
          onLoadMarker(archiveList[0]);
        }
      }
    });

    // 필수 입력 항목 체크
    async function isMstValid() {
      if (cscript.$isEmpty(artistList.value)) {
        alert('아티스트 선택은 필수입니다.');
        return false;
      }
      return true;
    }

    // 현재 설정값에 맞춰 archiveStore.getArchives를 호출하여, 데이터를 가져오는 함수
    function getArchives() {
      const { schBeginDe, schEndDe } = archiveSchParams.value;

      archiveStore.getArchives({
        page: paginationData.value.current - 1,
        perPage: paginationData.value.perPage,
        filter: { flds: { artist: Array.from(artistList.value) } },
        search: {
          start: schBeginDe && moment(schBeginDe).format('YYYY-MM-DD'),
          end: schEndDe && moment(schEndDe).format('YYYY-MM-DD')
        },
        sortOrder: orderData.value.value === 'newest' ? -1 : 1,
        sortField: 'startDate',
      });
    }

    // 아카이브 검색
    async function searchBtnFunc() {
      // 검색 조건 확인
      if (!await isMstValid()) {
        return;
      }
      searchData();
      isEarly = true;
      reset();
    }

    function searchData() {
      // 검색 데이터 생성
      let artistListSave : unknown[] = [];
      Object.entries(artistList.value).forEach(([, val]) => {
        artistListSave.push(val);
      });
      getArchives();
    }

    function resetFunc() {
      const msg = '초기화 하시겠습니까?';
      if (!confirm(msg)) {
        return;
      }

      // 검색 조건
      archiveSchParams.value = {
        artist: null,
      } as ArchiveSearchParams;

      reset();
    }

    function reset() {
      // 카페 목록
      archiveParams.value = {} as Archive;
      // 마커
      markerData.value = {} as Archive;
      // 정보창 열려있으면 닫기
      if(!cscript.$isEmpty(marker.value) && isOpen.value){
        isOpen.value = _.cloneDeep(!isOpen.value);
      }
      // 페이지네이션
      paginationData.value.maxCnt = null;
    }

    // 정렬 방식 변경 시, 호출되는 함수
    function orderSelectChange() {
      if (cscript.$isEmpty(archiveParams.value)) { return; }
      getArchives();
    }

    function detailBtnFunc(id: string | undefined) {
      if (!id) { return; }
      this.$router.push(`/archive/${id}`);
    }

    function paginationChange() {
      // 정보창 열려있으면 닫기
      if(!cscript.$isEmpty(marker.value) && isOpen.value){
        isOpen.value = _.cloneDeep(!isOpen.value);
      }
      searchData();
    }

    return {
      marker,
      mapOptions,
      onLoadMap,
      isOpen,
      markerData,
      detailArchive,
      artistList,
      onLoadMarker,
      onLoadInfoWindow,
      selectBoxOptions,
      archiveSchParams,
      archiveParams,
      searchBtnFunc,
      resetFunc,
      orderOptions,
      orderData,
      orderSelectChange,
      paginationData,
      paginationChange,
      detailBtnFunc
    }
  }
});

</script>

<style scoped>
</style>