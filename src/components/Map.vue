<template>
  <NaverMap
    v-if="!$q.screen.xs"
    style="width: 75%; height: 100vh; float: right"
    :mapOptions="MAP_OPTIONS"
    @onLoad="onLoadMap($event)"
  >
    <span v-if="markerData" v-for="marker in markerData" v-bind:key="marker._id">
      <NaverMarker :latitude="marker.lat" :longitude="marker.lng" @click="onClickMarker(marker)"> </NaverMarker>
    </span>

    <NaverInfoWindow :marker="marker" :open="isOpen" @onLoad="onLoadInfoWindow($event)">
      <div class="infowindow-style">
        <q-item class="archive-item">
          <q-item-section v-if="detailArchive">
            <q-item-label class="archive-title">{{ detailArchive.themeName }}</q-item-label>
            <q-item-label class="archive-account">{{ detailArchive.organizer }}</q-item-label>
            <q-item-label class="archive-address">{{ detailArchive.name }}</q-item-label>
            <q-item-label class="archive-address">{{ detailArchive.address }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <div class="infowindow-btn-box mb-2 pb-6">
        <q-btn type="button" class="detail-btn" @click="onClickDetailBtn(detailArchive._id)">상세보기</q-btn>
      </div>
    </NaverInfoWindow>
  </NaverMap>
</template>

<script setup lang="ts">
import { ref, computed, WritableComputedRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import _ from 'lodash';

import { NaverInfoWindow, NaverMap, NaverMarker } from 'vue3-naver-maps';

import { Archive } from '@/types/Archive';
import cscript from '@/composables/comScripts';
import { useMapStore } from '@/stores/map';

const router = useRouter();
const $q = useQuasar();
const mapStore = useMapStore();

const markerData = computed(() => mapStore.markerData);

const MAP_OPTIONS = {
  latitude: 37.51747, // 지도 중앙 위도
  longitude: 127.000022, // 지도 중앙 경도
  zoom: 13,
  zoomControl: false,
  zoomControlOptions: { position: 'TOP_RIGHT' },
};
const map = ref();
const marker = ref({} as Archive);
const infoWindow = ref();
const isOpen = ref(true);
const isEarly = ref(true);

const detailArchive: WritableComputedRef<Archive | undefined> = computed({
  get: () => mapStore.selectedArchive,
  set: (value: Archive | undefined) => {
    mapStore.setSelectedArchive(value);
  },
});

watch(markerData, () => {
  const firstMarker = markerData.value[0];
  if (firstMarker) {
    isEarly.value = true;
    onClickMarker(firstMarker);
  }
});

watch(detailArchive, () => {
  if (!detailArchive.value) {
    isOpen.value = false;
    return;
  }

  isOpen.value = true;

  const { lat, lng } = detailArchive.value;

  const latlng = new naver.maps.LatLng(lat, lng);
  marker.value = new naver.maps.Marker({
    position: latlng,
    draggable: true,
  });

  if (!isEarly.value) map.value.setCenter(latlng);
});

function onLoadMap(mapObject: unknown) {
  map.value = mapObject;
}

function onClickMarker(archive: Archive) {
  // 카페 목록 상세 가져오기
  detailArchive.value = _.cloneDeep(archive);
}

function onLoadInfoWindow(infoWindowObject) {
  infoWindow.value = infoWindowObject;
  if (isEarly.value) {
    infoWindow.value.close();
    isEarly.value = false;
    isOpen.value = false;
  }
}

function onClickDetailBtn(id: string | undefined) {
  if (!id) return;
  router.push(`/archive/${id}`);
}
</script>

<style scoped></style>
