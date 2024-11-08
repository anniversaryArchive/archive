<template>
  <!-- v-if="!$q.screen.xs" -->
  <NaverMap
    :class="isMobile ? 'isMobile' : 'isPc'"
    :mapOptions="MAP_OPTIONS"
    @onLoad="onLoadMap($event)"
  >
    <span v-if="markerData" v-for="marker in markerData" v-bind:key="marker._id">
      <NaverMarker :latitude="marker.lat" :longitude="marker.lng" @click="onClickMarker(marker, 'btn')"> </NaverMarker>
    </span>

    <NaverInfoWindow :marker="marker" :open="isOpen" @onLoad="onLoadInfoWindow($event)" id="info-window-all">
      <template v-if="selectedArchive">
        <div class="infowindow-style">
          <q-item class="archive-item">
            <q-item-section>
              <img :src="selectedArchive.mainImage?.path" alt="info-window-img" class="info-window-img">
            </q-item-section>
            <q-item-section class="info-window-text">
              <q-item-label class="archive-title">{{ selectedArchive.themeName }}</q-item-label>
              <q-item-label class="archive-account">{{ selectedArchive.organizer }}</q-item-label>
              <q-item-label class="archive-address">{{ selectedArchive.name }}</q-item-label>
              <q-item-label class="archive-address">{{ selectedArchive.address }}</q-item-label>
              <q-item-label class="archive-artist">#{{ selectedArchive.artist.name }}</q-item-label>
              <q-item-label>
                <div class="pb-6 mb-2 infowindow-btn-box">
                  <q-btn type="button" class="detail-btn" @click="onClickDetailBtn(selectedArchive._id)">상세보기</q-btn>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </template>
    </NaverInfoWindow>
  </NaverMap>
</template>

<script setup lang="ts">
import {ref, computed, watch, Ref, ComputedRef} from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { NaverInfoWindow, NaverMap, NaverMarker } from 'vue3-naver-maps';

import { Archive } from '@/types/Archive';
import { useMapStore } from '@/stores/map';
import {isEmpty} from 'lodash';

const router = useRouter();
const $q = useQuasar();
const mapStore = useMapStore();

const isMobile: ComputedRef<boolean> = computed(() => $q.screen.sm || $q.screen.xs);

const markerData = computed(() => mapStore.markerData);

const MAP_OPTIONS = {
  latitude: 37.51747, // 지도 중앙 위도
  longitude: 127.000022, // 지도 중앙 경도
  zoom: 13,
  zoomControl: false,
  zoomControlOptions: { position: 'TOP_RIGHT' },
};
const map = ref();
const marker = ref({});
const infoWindow = ref();
const isOpen = ref(true);
const isEarly = ref(true);

const selectedArchive: Ref<Archive | undefined> = ref();

watch(markerData, () => {
  const firstMarker = markerData.value[0];
  if (firstMarker) {
    isEarly.value = true;
    onClickMarker(firstMarker);
  }
});

watch(
  () => mapStore.selectedArchive,
  value => {
    if(!isEmpty(value)) {
      selectedArchive.value = value;
    }
    if (!mapStore.selectedArchive) {
      isOpen.value = false;
      return;
    }

    isOpen.value = true;

    const { lat, lng } = mapStore.selectedArchive;

    const latlng = new naver.maps.LatLng(lat, lng);
    marker.value = new naver.maps.Marker({
      position: latlng,
      draggable: true,
    });

    if (!isEarly.value) map.value.setCenter(latlng);
  },
);

function onLoadMap(mapObject: unknown) {
  map.value = mapObject;
}

function onClickMarker(archive: Archive, type?: String) {
  if(isMobile.value && type === 'btn') {
    router.push(`/archive/${archive._id}`);
  }
  // 카페 목록 상세 가져오기
  setSelectedArchive(archive);
}

function onLoadInfoWindow(infoWindowObject: any) {
  infoWindow.value = infoWindowObject;

  // infowindow-style 상위 div 접근
  const element: HTMLElement | null = document.getElementById('info-window-all');
  const parent = element?.parentElement;
  parent?.classList.add('info-window-parent');

  if (isEarly.value) {
    infoWindow.value.close();
    isEarly.value = false;
    isOpen.value = false;
  }
}

function setSelectedArchive(archive: Archive) {
  mapStore.selectedArchive = { ...archive };
}

function onClickDetailBtn(id: string | undefined) {
  if (!id) return;
  router.push(`/archive/${id}`);
}
</script>

<style scoped>
/* NaverMap */
.isPc {
  width: 75%;
  height: 100%;
  float: right
}
.isMobile {
  width: 100%;
  height: 100%;
}

</style>
