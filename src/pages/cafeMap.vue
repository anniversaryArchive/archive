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

      <q-list v-if="archiveParams">
        <q-item v-for="(archive) in archiveParams" v-bind:key="archiveParams" class="archive-item" clickable>
          <q-item-section>
            <q-item-label class="archive-title">{{archive.themeName}}</q-item-label>
            <q-item-label class="archive-account">{{archive.organizer}}</q-item-label>
            <q-item-label class="archive-address">{{archive.address}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <naver-map style="width: 75%; height: 100vh; float: right;" :mapOptions="mapOptions">
      <naver-marker
          @click="isOpen = !isOpen"
          :latitude="37.51347"
          :longitude="127.041722"
          @onLoad="onLoadMarker($event)"
      >
      </naver-marker>
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
import { NaverMap, NaverMarker, NaverInfoWindow } from "vue3-naver-maps";
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';
import LayoutHeader from '@/layouts/LayoutHeader.vue';
import ccobject from '@/composables/createComObject';
import {useArtistStore} from '@/stores/artist';
import cscript from '@/composables/comScripts';
import {Archive, ArchiveSearchParams} from '@/types/Archive';
import {useArchiveStore} from '@/stores/archive';
import moment from 'moment/moment';
import _ from 'lodash';

export default defineComponent({
  name        : 'cafeMap',
  components: { LayoutHeader, NaverMap, NaverMarker, NaverInfoWindow },
  mixins: [mixinPageCommon],
  setup(){
    // 아티스트 멀티 셀렉트박스 배열 변수
    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);
    const {schParams: archiveSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

    const archiveParams = ref({} as Archive);

    const map = ref();
    const mapOptions = {
      latitude: 37.51347, // 지도 중앙 위도
      longitude: 127.041722, // 지도 중앙 경도
      zoom: 13,
      zoomControl: false,
      zoomControlOptions: { position: "TOP_RIGHT" },
    };

    const initLayers = [
      "BACKGROUND",
      "BACKGROUND_DETAIL",
      "POI_KOREAN",
      "TRANSIT",
      "ENGLISH",
    ];

    const marker = ref();
    const infoWindow = ref();
    const isOpen = ref(true); // false: 안보임, true: 보임

    const onLoadMarker = (markerObject: unknown) => {
      marker.value = markerObject;
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
      const filterData = {
        "flds": {
          "group" : "63e589617df4af219e0401c5"
        }
      }
      artistStore.getArtists(filterData);
      archiveStore.getArchives();
    }

    watch(() => artistStore.artists, async () => {
      const artistList = JSON.parse(JSON.stringify(artistStore.artists));

      selectBoxOptions.value.artist = {
        name     : 'artistStatusOptions',
        clearable: true,
        style    : 'width: 250px',
      };
      selectBoxOptions.value.artist.data = await cscript.$getComboOptions(artistList);

      //초기값 셋팅
      archiveSchParams.value.artist = selectBoxOptions.value.artist.data[0].value;
    });

    watch(() => archiveStore.Archives, async () => {
      // 카페 목록 초기화 및 재할당
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

      // 검색 데이터 생성
      const filterData = {
        "flds": {
          "artist" : "63fae6ba92f11faaa75ca5f4", //artistsSchParams.value.artist,
          "startDate" : archiveSchParams.value.schBeginDe ? moment(archiveSchParams.value.schBeginDe).format('YYYY-MM-DD') : "",
          "endDate" : archiveSchParams.value.schEndDe ? moment(archiveSchParams.value.schEndDe).format('YYYY-MM-DD') : "",
        }
      }

      // console.log('filterData : ', filterData);
      archiveStore.getArchives(filterData);
      const archiveList = JSON.parse(JSON.stringify(archiveStore.Archives));

      archiveParams.value = _.cloneDeep(archiveList);
      console.log('archiveParams : ', archiveParams.value);
    }

    function resetFunc() {
      const msg = '초기화 하시겠습니까?';
      if (!confirm(msg)) {
        return;
      }

      console.log('artistsSchParams.value : ', archiveSchParams.value);

      // 검색폼 / 카페 목록 초기화
      archiveSchParams.value = {
        artist    : selectBoxOptions.value.artist.data[0].value,
        schBeginDe: '',
        schEndDe  : ''
      } as ArchiveSearchParams;

      console.log('artistsSchParams.value : ', archiveSchParams.value);
    }

    return {
      marker,
      mapOptions,
      initLayers,
      onLoadMap,
      isOpen,
      onLoadMarker,
      onLoadInfoWindow,
      selectBoxOptions,
      archiveSchParams,
      archiveParams,
      searchBtnFunc,
      resetFunc
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