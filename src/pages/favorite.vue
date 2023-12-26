<template>
  <div class="h-screen">
    <q-card class="relative h-screen py-4 my-card">
      <h6 class="font-bold text-center">즐겨찾기</h6>

      <ul>
        <li class="p-2 border-b border-gray-300" @click="isShowCreateFavoriteDialog = true">새 즐겨찾기 만들기</li>

        <li v-for="item in list" class="flex flex-wrap p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100">
          <div
            class="flex flex-col justify-center w-5 h-5 mr-2 text-center rounded-full"
            :style="`background-color: ${item.color}`"
          >
            <q-icon name="favorite" class="m-auto text-white" />
          </div>
          <div>{{ item.title }}</div>
        </li>
      </ul>

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
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';

import BottomDialog from '@/dialogs/BottomDialog.vue';
import { query, mutate } from '@/composables/graphqlUtils';
import getFavoritesGroup from '@/graphql/getFavoritesGroup.query.gql';
import createFavoriteGroupMutate from '@/graphql/createFavoriteGroup.mutate.gql';

const list = ref([]);
const createFavoriteGroup: Ref<{ title: string; color?: string }> = ref({ title: '' });
const isShowCreateFavoriteDialog = ref(false);

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
