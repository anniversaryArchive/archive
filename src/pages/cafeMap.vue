<template>
  <div>
    <!--
    <naver-map
        style="width: 80%; height: 1000px;"
        :mapOptions="mapOptions"
        :initLayers="initLayers"
        @onLoad="onLoadMap($event)"
    >
    -->
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
import {defineComponent, ref} from 'vue';
import { NaverMap, NaverMarker, NaverInfoWindow } from "vue3-naver-maps";
import mixinPageCommon from '@/pages/mixin/mixinPageCommon';

export default defineComponent({
  name        : 'cafeMap',
  components: { NaverMap, NaverMarker, NaverInfoWindow },
  mixins: [mixinPageCommon],
  setup(){
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
      console.log('mapObject : ', mapObject);
      map.value = mapObject;
    };

    return {
      marker,
      mapOptions,
      initLayers,
      onLoadMap,
      isOpen,
      onLoadMarker,
      onLoadInfoWindow
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
</style>