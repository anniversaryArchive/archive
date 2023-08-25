<template>
  <div class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-10 m-auto bg-white rounded h-4/5">
      <header class="flex pb-4 border-b border-gray-400">
        <div class="flex-1 text-2xl font-bold">소통창구</div>
        <div v-if="loggedIn">
          <router-link to="/communication-board/create"
            class="px-4 py-1 border border-gray-300 rounded hover:bg-gray-200">글쓰기</router-link>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto">
        <!-- 번호 / 분류 / 제목 / 날짜 / 작성자 -->
        <q-table
          :rows="communicationBoards"
          :columns="TABLE_COLUMNS"
          row-key="_id"
          hide-pagination flat
          :pagination.sync="{ rowsPerPage: perPage }"
          @row-click="onClick"
          class="flex-1" />
        <div class="justify-center mt-4 row q-mt-md">
          <q-pagination
            direction-links
            v-model="currentPage"
            :max="maxPage"
            @update:model-value="onChangePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment/moment';
import { query } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommnunicationBoard';
import { useUserStore } from '@/stores/user';
import { TABLE_COLUMNS } from './data';

import getCommunicationBoardsQuery from '@/graphql/getCommunicationBoards.query.gql';

const router = useRouter();
const userStore = useUserStore();

const currentPage: Ref<number> = ref(1);
const total: Ref<number> = ref(0);
const perPage: number = 10;

const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const maxPage: ComputedRef<number> = computed(() => {
  return Math.ceil(total.value / perPage);
});

const communicationBoards: Ref<CommnunicationBoard[]> = ref([]);

onBeforeMount(() => {
  getCommunicationBoards();
});

function getCommunicationBoards() {
  query(getCommunicationBoardsQuery, {
    page: currentPage.value - 1,
    perPage,
  }, false).then(({ data, error, execute }) => {
    if (!data.value?.communicationBoard) { return; }
    communicationBoards.value = data.value.communicationBoard.data || [];
    total.value = data.value.communicationBoard.total || 0;
  });
}

function onChangePage(event) {
  getCommunicationBoards();
}

function onClick(_, row) {
  router.push(`/communication-board/${row._id}`);
}
</script>

<style lang="scss" scoped>

</style>
