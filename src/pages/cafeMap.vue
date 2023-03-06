<template>
  <div>
    <layout-header></layout-header>

    <q-card class="my-card" style="width: 25%; float: left;">
      <div class="search-box">
        <h1 class="search-text">멤버 선택</h1>
        <select-box id="artist" v-model='archiveSchParams.artist' v-bind='selectBoxOptions.artist' style="width: 100%;"
                    :multiplied='false'
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
        <q-item v-for="(archive) in archiveParams" v-bind:key="archiveParams" class="archive-item" clickable
                @click="onLoadMarker(archive)">
          <q-item-section>
            <q-item-label class="archive-title">{{archive.themeName}}</q-item-label>
            <q-item-label class="archive-account">{{archive.organizer}}</q-item-label>
            <q-item-label class="archive-address">{{archive.address}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div v-if="paginationData.maxCnt" class="q-pa-lg flex flex-center">
        <q-pagination
            v-model="paginationData.current"
            :max="paginationData.maxCnt"
            @update:model-value="paginationChange()"
            direction-links
        />
      </div>
    </q-card>

    <naver-map style="width: 75%; height: 100vh; float: right;" :mapOptions="mapOptions">
      <span v-if="markerData" v-for="(marker) in markerData" v-bind:key="markerData">
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
        <div class="infowindow-style">click Marker!😎</div>
      </naver-info-window>
    </naver-map>
  </div>
</template>

<script lang="ts">
import {defineComponent, onBeforeMount, ref, watch} from 'vue';
import {NaverInfoWindow, NaverMap, NaverMarker} from 'vue3-naver-maps';
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import LayoutHeader from '@/layouts/LayoutHeader.vue';
import ccobject from '@/composables/createComObject';
import {useArtistStore} from '@/stores/artist';
import cscript from '@/composables/comScripts';
import {Archive, ArchiveSearchParams} from '@/types/Archive';
import {useArchiveStore} from '@/stores/archive';
import _ from 'lodash';
import {Pagination} from '@/types/CommonTypes';


export default defineComponent({
  name      : 'cafeMap',
  components: {LayoutHeader, NaverMap, NaverMarker, NaverInfoWindow},
  mixins    : [mixinPageCommon],
  setup() {
    // 아티스트 멀티 셀렉트박스 배열 변수
    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    const archiveParams = ref({} as Archive);

    const map = ref();
    const markerData = ref({} as Archive);
    const mapOptions = {
      latitude          : 37.51747, // 지도 중앙 위도
      longitude         : 127.000022, // 지도 중앙 경도
      zoom              : 13,
      zoomControl       : false,
      zoomControlOptions: {position: 'TOP_RIGHT'},
    };

    const initLayers = [
      'BACKGROUND',
      'BACKGROUND_DETAIL',
      'POI_KOREAN',
      'TRANSIT',
      'ENGLISH',
    ];

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

    const onLoadMarker = (markerObject: Archive) => {
      /*if(!cscript.$isEmpty(marker.value)){
        isOpen.value = _.cloneDeep(!isOpen.value);
      }*/

      const latlng = new naver.maps.LatLng(markerObject.lat, markerObject.lng);
      marker.value = new naver.maps.Marker({
        position : latlng,
        draggable: true,
      });

      // 카페 목록 상세 가져오기
    };

    const onLoadInfoWindow = (infoWindowObject: unknown) => {
      infoWindow.value = infoWindowObject;
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
          'group': '63e589617df4af219e0401c5',
        },
      };
      artistStore.getArtists(artistFilterData);
      archiveStore.getArchives();
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

    watch(() => archiveStore.Archives, async () => {
      // 카페 목록 초기화 및 검색 버튼 이후에 할당
      if (!cscript.$isEmpty(archiveSchParams.value.artist)) {
        let archiveList = JSON.parse(JSON.stringify(archiveStore.Archives));

        // orderData 확인
        archiveList = orderDataFunc(archiveList, orderData.value.value);
        archiveParams.value = _.cloneDeep(archiveList);

        // 페이지네이션 설정
        paginationData.value.maxCnt = archiveStore.total / paginationData.value.perPage;

        // 지도 마커 생성
        markerData.value = _.cloneDeep(archiveList);
      }
    });

    // 필수 입력 항목 체크
    async function isMstValid() {
      if (cscript.$isEmpty(archiveSchParams.value.artist)) {
        alert('아티스트 선택은 필수입니다.');
        return false;
      }
      return true;
    }

    // 아카이브 검색
    async function searchBtnFunc() {
      // 검색 조건 확인
      if (!await isMstValid()) {
        return;
      }
      searchData();
    }

    function searchData() {
      // 검색 데이터 생성
      const filterData = {
        "flds": {
          "artist" : "63fae6ba92f11faaa75ca5f4", //artistsSchParams.value.artist,
          // "startDate" : archiveSchParams.value.schBeginDe ? moment(archiveSchParams.value.schBeginDe).format('YYYY-MM-DD') : "",
          // "endDate" : archiveSchParams.value.schEndDe ? moment(archiveSchParams.value.schEndDe).format('YYYY-MM-DD') : "",
        }
      }

      archiveStore.getArchives(paginationData.value.current-1, paginationData.value.perPage, filterData);
    }

    function orderDataFunc(list: any, key: string) {
      switch (key) {
        case 'newest': return descOrdSortDate(list);
        case 'oldest': return ascOrdSortDate(list);
        default: return list;
      }
    }

    // 오름차순
    function ascOrdSortDate(list : any) {
      return list.sort(function (a: { startDate: string | number | Date; }, b: { startDate: string | number | Date; }) {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    }

    // 내림차순
    function descOrdSortDate(list : any) {
      return list.sort(function (a: { startDate: string | number | Date; }, b: { startDate: string | number | Date; }) {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }).reverse();
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
      // 카페 목록
      archiveParams.value = {} as Archive;
    }

    function orderSelectChange() {
      if(!cscript.$isEmpty(archiveParams.value)){
        const changeData = orderDataFunc(archiveParams.value, orderData.value.value);
        archiveParams.value = _.cloneDeep(changeData);
      }
    }

    function paginationChange() {
      searchData();
    }

    return {
      marker,
      mapOptions,
      initLayers,
      onLoadMap,
      isOpen,
      markerData,
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
      paginationChange
    }
  }
});

</script>

<style>
  .infowindow-style {
    color: black;
    background-color: white;
    text-align: center;
    font-weight: 600;
    font-size: 20px;
    padding: 6px 8px;
  }

  .search-box {
    padding: 15px;
    border-bottom: 1px solid #CCCCCC;
  }

  .list-order {
    padding-left: 15px;
    border-bottom: 1px solid #CCCCCC;
  }

  .search-text {
    padding-top : 15px;
    font-weight: 400;
    font-size: 16px;
    line-height: 30px;
  }

  .archive-item {
    border-bottom: 1px solid #CCCCCC;
  }

  .archive-title {
    font-weight: 400;
    font-size: 16px;
    line-height: 30px;
  }

  .archive-account {
    font-weight: 400;
    font-size: 12px;
    line-height: 22px;
    color: #767676;
  }

  .archive-address {
    font-weight: 400;
    font-size: 14px;
    line-height: 25px;
    color: #767676;
  }

  .btn-box {
    padding-top : 15px;
  }

  .btn-box button {
    border: 1px solid #CCCCCC;
    border-radius: 5px;
  }

  .search-btn {
    float: right;
  }

</style>