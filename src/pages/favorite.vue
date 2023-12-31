<template>
  <div class="h-screen">
    <q-card class="relative h-screen py-4 my-card">
      <h6 class="font-bold text-center">즐겨찾기 ({{ list.length || 0 }})</h6>

      <ul>
        <li class="flex px-4 py-4 font-semibold border-b border-gray-300" @click="isShowCreateFavoriteDialog = true">
          <q-icon name="add_circle_outline" size="sm" class="my-auto text-gray-300" />
          <div class="flex-1 my-auto ml-2 text-gray-600">새 즐겨찾기 만들기</div>
        </li>

        <li
          v-for="item in list"
          class="flex flex-wrap px-4 py-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
        >
          <div
            class="flex flex-col justify-center w-5 h-5 mr-2 text-center rounded-full"
            :style="`background-color: ${item.color}`"
          >
            <q-icon name="favorite" class="m-auto text-white" />
          </div>
          <div class="font-semibold">{{ item.title }}</div>
        </li>
      </ul>

      <!-- 즐겨찾기 추가 Bottom Dialog -->
      <BottomDialog height="65%" :show="isShowCreateFavoriteDialog" @hide="hideCreateFavoriteDialog">
        <template v-slot:title>새 즐겨찾기 추가</template>
        <template v-slot:content>
          <div class="px-4">
            <div>
              <label class="font-bold">즐겨찾기명</label>
              <q-input v-model="createFavoriteGroup.title" placeholder="즐결찾기명" />
            </div>

            <div class="mt-4">
              <label class="font-bold">색상 선택</label>
              <q-color v-model="createFavoriteGroup.color" />
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div class="flex">
            <div
              class="flex-1 py-3 font-bold text-center text-gray-800 bg-gray-200 hover:bg-gray-400"
              @click="hideCreateFavoriteDialog"
            >
              취소
            </div>
            <div class="flex-1 py-3 font-bold text-center text-white bg-primary/80 hover:bg-primary" @click="create">
              저장
            </div>
          </div>
        </template>
      </BottomDialog>
    </q-card>

    <NaverMap
      v-if="!$q.screen.xs"
      style="width: 75%; height: 100vh; float: right"
      :mapOptions="mapOptions"
      @onLoad="onLoadMap($event)"
    >
      <span v-if="markerData" v-for="marker in markerData" v-bind:key="marker._id">
        <NaverMarker @click="onLoadMarker(marker)" :latitude="marker.lat" :longitude="marker.lng"> </NaverMarker>
      </span>

      <NaverInfoWindow :marker="marker" :open="isOpen">
        <div class="infowindow-style">
          <q-item class="archive-item">
            <q-item-section>
              <q-item-label class="archive-title">{{ detailArchive.themeName }}</q-item-label>
              <q-item-label class="archive-account">{{ detailArchive.organizer }}</q-item-label>
              <q-item-label class="archive-address">{{ detailArchive.name }}</q-item-label>
              <q-item-label class="archive-address">{{ detailArchive.address }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="infowindow-btn-box">
          <q-btn type="button" class="detail-btn" @click="detailBtnFunc(detailArchive._id)">상세보기</q-btn>
        </div>
      </NaverInfoWindow>
    </NaverMap>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { NaverInfoWindow, NaverMap, NaverMarker } from 'vue3-naver-maps';

import BottomDialog from '@/dialogs/BottomDialog.vue';
import { query, mutate } from '@/composables/graphqlUtils';
import getFavoritesGroup from '@/graphql/getFavoritesGroup.query.gql';
import createFavoriteGroupMutate from '@/graphql/createFavoriteGroup.mutate.gql';
import { Archive } from '@/types/Archive';

const router = useRouter();
const $q = useQuasar();

const list = ref([]);
const createFavoriteGroup: Ref<{ title: string; color?: string }> = ref({ title: '' });
const isShowCreateFavoriteDialog = ref(false);

// 지도 관련 변수
const map = ref();
const mapOptions = {
  latitude: 37.51747, // 지도 중앙 위도
  longitude: 127.000022, // 지도 중앙 경도
  zoom: 13,
  zoomControl: false,
  zoomControlOptions: { position: 'TOP_RIGHT' },
};
const markerData = ref({} as Archive);
const detailArchive = ref({} as Archive);
const isOpen = ref(false);

onBeforeMount(() => {
  getList();
});

function getList() {
  query(getFavoritesGroup, {}, false).then(({ data, error }) => {
    list.value = data.value?.list || [];
  });
}

function onLoadMap(mapObject: unknown) {
  map.value = mapObject;
}

function onClickDetailBtn(id: string | undefined) {
  if (!id) return;
  router.push(`/archive/${id}`);
}

function hideCreateFavoriteDialog() {
  isShowCreateFavoriteDialog.value = false;
}

function create() {
  isShowCreateFavoriteDialog.value = false;
  mutate(createFavoriteGroupMutate, {
    input: {
      ...createFavoriteGroup.value,
    },
  }).then(({ data }) => {
    const { favoriteGroup } = data;
    if (favoriteGroup) {
      list.value.push(favoriteGroup);
    }
    createFavoriteGroup.value = { title: '' };
  });
}
</script>

<style scoped></style>
