<template>
  <div>
    <layout-header></layout-header>

    <q-card class="my-card" style="width: 25%; float: left;">
      <div class="search-box">
        <h1 class="search-text">멤버 선택</h1>
        <select-box id="artist" v-model='artistList' v-bind='selectBoxOptions.artist' style="width: 100%;"
                    :multiplied='false'
                    use-chips/>
        <h1 class="search-text">기간 선택</h1>
        <com-period-date-picker v-model='artistsSchParams'
                                :clearable="true" :disabled='false' :readonly='false'
                                beginDeNm="schBeginDe" endDeNm="schEndDe"/>
      </div>

      <q-list>
        <q-item clickable>
          <q-item-section>
            <q-item-label class="archive-title">[형원] 나의 하루는 오늘도 너에게</q-item-label>
            <q-item-label class="archive-account">@with_my_H</q-item-label>
            <q-item-label class="archive-address"> 서울 마포구 어울마당로5길 25 1층</q-item-label>
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
import {ArchiveSearchParams} from '@/types/Archive';

export default defineComponent({
  name        : 'cafeMap',
  components: { LayoutHeader, NaverMap, NaverMarker, NaverInfoWindow },
  mixins: [mixinPageCommon],
  setup(){
    // 아티스트 멀티 셀렉트박스 배열 변수
    const artistList = ref([] as string[]);
    const artistListOrgData = ref([] as string[]);
    const {selectBoxOptions: selectBoxOptions} = ccobject.$createSelectAll(['artist']);
    const {schParams: artistsSchParams} = ccobject.$createSchParams<ArchiveSearchParams>();

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

    onBeforeMount(() => {
      initialize();
    });

    const initialize = () => {
      const filterData = {
        "flds": {
          "group" : "63e589617df4af219e0401c5"
        }
      }
      artistStore.getArtists(filterData);
    }

    watch(() => artistStore.artists, async () => {
      const artistList = JSON.parse(JSON.stringify(artistStore.artists));
      console.log('artistList : ', artistStore.artists);

      selectBoxOptions.value.artist = {
        name     : 'artistStatusOptions',
        clearable: true,
        style    : 'width: 250px',
      };
      selectBoxOptions.value.artist.data = await cscript.$getComboOptions(artistList);
    });

    return {
      marker,
      mapOptions,
      initLayers,
      onLoadMap,
      isOpen,
      onLoadMarker,
      onLoadInfoWindow,
      artistList,
      selectBoxOptions,
      artistsSchParams
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
    font-weight: 400;
    font-size: 16px;
    line-height: 30px;
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

</style>