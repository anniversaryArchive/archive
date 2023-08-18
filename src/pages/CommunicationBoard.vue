<template>
  <div>
    <div class="text-3xl">소통 창구 {{ communicationBoards.length }}</div>
    <!-- 번호 / 분류 / 제목 / 날짜 / 작성자 -->
     <q-table
      :rows="communicationBoards"
      :columns="columns"
      row-key="seq"
      hide-pagination
    />
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="currentPage"
        color="grey-8"
        :max="maxPage"
        size="sm"
        @update:model-value="onChangePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef } from 'vue';
import moment from 'moment/moment';
import { query } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommnunicationBoard';

import getCommunicationBoardsQuery from '@/graphql/getCommunicationBoards.query.gql';

const currentPage: Ref<number> = ref(1);
const total: Ref<number> = ref(0);
const perPage: number = 1;

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
    field: row => row.author.name,
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
</script>

<style lang="scss" scoped>

</style>
