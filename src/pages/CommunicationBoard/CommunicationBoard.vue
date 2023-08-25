<template>
  <div class="flex flex-col justify-center h-full">
    <div class="w-4/5 p-10 m-auto bg-white rounded h-4/5">
      <header class="flex pb-4 border-b border-gray-400">
        <div class="flex-1 text-2xl font-bold">소통창구</div>
        <div v-if="loggedIn">
          <router-link to="/communication-board/create"
            class="px-4 py-1 border border-gray-300 rounded hover:bg-gray-200">글쓰기</router-link>
        </div>
      </header>
      <!-- 번호 / 분류 / 제목 / 날짜 / 작성자 -->
      <q-table
        :rows="communicationBoards"
        :columns="columns"
        row-key="_id"
        hide-pagination flat
        @row-click="onClick"
      />
      <div class="justify-center row q-mt-md">
        <q-pagination
          v-model="currentPage"
          color="grey-8"
          :max="maxPage"
          size="sm"
          @update:model-value="onChangePage"
        />
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

import getCommunicationBoardsQuery from '@/graphql/getCommunicationBoards.query.gql';

const router = useRouter();
const userStore = useUserStore();

const currentPage: Ref<number> = ref(1);
const total: Ref<number> = ref(0);
const perPage: number = 5;

const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const maxPage: ComputedRef<number> = computed(() => {
  return Math.ceil(total.value / perPage);
});

const communicationBoards: Ref<CommnunicationBoard[]> = ref([]);

const columns = [
  {
    name: 'seq',
    required: true,
    label: '번호',
    align: 'left',
    field: row => row.seq,
    format: val => `${val}`,
  }, {
    name: 'division',
    required: true,
    label: '분류',
    field: row => row.division,
  }, {
    name: 'title',
    required: true,
    label: '제목',
    field: row => row.title,
  }, {
    name: 'createdAt',
    required: true,
    label: '날짜',
    field: row => row.createdAt,
    format: val => moment(val).format('YYYY.MM.DD HH:mm').toString(),
  }, {
    name: 'author',
    required: true,
    label: '작성자',
    field: row => row.author?.name,
  }
];

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
