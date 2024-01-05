<template>
  <div>
    <div class="mx-4 text-center" @click="goToList">
      <button
        class="w-full py-2 font-bold text-gray-600 border border-gray-600 rounded-lg hover:border-primary hover:text-primary"
      >
        전체 리스트 보기
      </button>
    </div>

    <template v-if="favoriteGroup">
      <!-- 현재 Favorite Group에 대한 정보 -->
      <div class="mt-6 mb-4 text-center">
        <div class="inline-block align-middle">
          <div
            class="flex flex-col justify-center w-5 h-5 mr-2 text-center rounded-full"
            :style="`background-color: ${favoriteGroup.color}`"
          >
            <q-icon name="favorite" class="m-auto text-white" />
          </div>
        </div>

        <div class="inline-block text-xl font-bold align-middle">{{ favoriteGroup.title }}</div>
      </div>

      <!-- 즐겨찾기 그룹 내 카페 리스트 -->
      <q-list>
        <CafeItem v-for="archive in favoriteGroup.archives" :archive="archive" @click="onClickArchive(archive)" />
      </q-list>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { query } from '@/composables/graphqlUtils';
import { Archive } from '@/types/Archive';
import { useMapStore } from '@/stores/map';
import CafeItem from '@/components/CafeItem.vue';

import getFavoritesGroup from '@/graphql/getFavoritesGroupItem.query.gql';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const mapStore = useMapStore();

const favoriteGroup = ref(); // 즐겨찾기 그룹 정보

onBeforeMount(() => {
  const id = route.params.id;
  getData(id);
});

function getData(id: string) {
  query(getFavoritesGroup, { id }, false).then(({ data, error }) => {
    favoriteGroup.value = data.value.favoriteGroup;
    mapStore.setMarkerData(favoriteGroup.value?.archives || []);
  });
}

// 카페 클릭 시
function onClickArchive(archive: Archive) {
  if ($q.screen.xs) {
    router.push(`/archive/${archive._id}`);
  } else {
    mapStore.setSelectedArchive(archive);
  }
}

// 전체 리스트 보기
function goToList() {
  router.push('/favorite');
}
</script>

<style scoped></style>
