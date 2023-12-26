<template>
  <div class="h-screen">
    <q-card class="h-screen py-4 my-card">
      <h6 class="font-bold text-center">즐겨찾기</h6>

      <ul>
        <li class="p-2 border-b border-gray-300">새 즐겨찾기 만들기</li>

        <li v-for="item in list" class="flex flex-wrap p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100">
          <div
            class="flex flex-col justify-center w-5 h-5 mr-2 text-center rounded-full"
            :class="[`bg-[${item.color}]`]"
          >
            <q-icon name="favorite" class="m-auto text-white" />
          </div>
          <div>{{ item.title }}</div>
        </li>
      </ul>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';

import { query } from '@/composables/graphqlUtils';
import getFavoritesGroup from '@/graphql/getFavoritesGroup.query.gql';

const list = ref([]);

onBeforeMount(() => {
  getList();
});

function getList() {
  query(getFavoritesGroup, {}, false).then(({ data, error }) => {
    list.value = data.value?.list || [];
  });
}
</script>

<style scoped></style>
