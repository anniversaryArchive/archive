<template>
  <div class="h-screen">
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
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { useMapStore } from '@/stores/map';
import BottomDialog from '@/dialogs/BottomDialog.vue';
import { query, mutate } from '@/composables/graphqlUtils';
import getFavoritesGroup from '@/graphql/getFavoritesGroup.query.gql';
import createFavoriteGroupMutate from '@/graphql/createFavoriteGroup.mutate.gql';
import { Archive } from '@/types/Archive';

const router = useRouter();
const $q = useQuasar();
const mapStore = useMapStore();

const list = ref([]);
const createFavoriteGroup: Ref<{ title: string; color?: string }> = ref({ title: '' });
const isShowCreateFavoriteDialog = ref(false);

watch(list, () => {
  let archives: Archive[] = [];
  for (const item of list.value) {
    if (item.archives) {
      archives = archives.concat(item.archives.map(archive => archive as Archive));
    }
  }

  mapStore.setMarkerData(archives);
});

onBeforeMount(() => {
  getList();
});

function getList() {
  query(getFavoritesGroup, {}, false).then(({ data, error }) => {
    list.value = data.value?.list || [];
  });
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
