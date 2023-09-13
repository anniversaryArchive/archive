<template>
  <div class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-10 m-auto bg-white rounded h-4/5">
      <header class="flex pb-4 border-b border-gray-400">
        <div class="flex-1 text-2xl font-bold">소통창구</div>

        <!-- 구분 Filter -->
        <div class="w-40 text-lg font-extrabold text-center text-primary">
          <q-select :model-value="filter.division"
            :options="divisionOptions"
            :option-label="(opt: CommunicationBoardDivision) => DIVISION_LABEL[opt] || opt"
            @update:model-value="onChangeDivision"
            class="mr-4"></q-select>
        </div>

        <!-- 내 글 보기 / 전체 글 보기 -->
        <div>
          <button class="px-4 py-1 border border-gray-400 rounded hover:bg-gray-200"
            @click="changeShowType">
            {{ filter.showType === 'mine' ? '전체 글 보기' : '내 글 보기' }}
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto">
        <!-- 번호 / 분류 / 제목 / 날짜 / 작성자 -->
        <q-table
          row-key="_id" hide-pagination flat
          :rows="communicationBoards"
          :columns="TABLE_COLUMNS"
          :pagination.sync="{ rowsPerPage: perPage }"
          @row-click="onClick"
          class="flex-1" />
      </div>

      <footer>
        <div class="justify-center mt-4 row q-mt-md">
          <q-pagination
            :model-value="filter.page"
            direction-links
            :max="maxPage"
            @update:model-value="onChangePage" />
        </div>

        <!-- 글쓰기 버튼 : 로그인한 유저에게만 보인다. -->
        <div v-if="loggedIn" class="text-right">
          <router-link to="/communication-board/create"
            class="px-4 py-1 border border-gray-300 rounded hover:bg-gray-200">글쓰기</router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import moment from 'moment/moment';
import { query } from '@/composables/graphqlUtils';
import { CommunicationBoard } from '@/types/CommunicationBoard';
import { useUserStore } from '@/stores/user';
import { TABLE_COLUMNS, DIVISION_OPTIONS, DIVISION_LABEL } from './data';

import getCommunicationBoardsQuery from '@/graphql/getCommunicationBoards.query.gql';

interface Filter {
  division?: CommunicationBoardDivision,
  showType: 'mine' | 'all',
  page: number,
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// pagination 관련 변수
const total: Ref<number> = ref(0);
const perPage: number = 10;
const maxPage: ComputedRef<number> = computed(() => Math.ceil(total.value / perPage));

const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const communicationBoards: Ref<CommunicationBoard[]> = ref([]);

const noneDivision = '구분 선택';
const divisionOptions: ComputedRef<(CommunicationBoardDivision | 'none')[]> = computed(() => {
  return [noneDivision, ...DIVISION_OPTIONS];
});
const filter: Ref<Filter> = ref({ division: noneDivision, showType: 'all', page: 1 });

// Filter가 변경될 떄마다 route를 replace해주고, CommunicationBoard data를 가져온다.
watch(filter, () => {
  router.replace({ name: 'CommunicationBoard', query: filter.value });
  getCommunicationBoards();
});

onBeforeMount(() => initialize());

function initialize() {
  for (const key of ['division', 'showType', 'page']) {
    if (!route.query[key]) { continue; }
    filter.value[key] = key === 'page' ? Number(route.query[key]) : route.query[key];
  }
  getCommunicationBoards();
}

function getCommunicationBoards() {
  const flds = {};
  if (filter.value.division !== noneDivision) {
    flds.division = filter.value.division;
  }
  if (filter.value.showType === 'mine') {
    flds.author = userStore.id;
  }
  query(getCommunicationBoardsQuery, {
    page: filter.value.page - 1,
    perPage,
    filter: { flds },
  }, false).then(({ data, error, execute }) => {
    if (!data.value?.communicationBoard) { return; }
    communicationBoards.value = data.value.communicationBoard.data || [];
    total.value = data.value.communicationBoard.total || 0;
  });
}

// 페이지 변경 시
function onChangePage(page: number) {
  filter.value = { ... filter.value, page };
}

// Table Row 클릭 시
function onClick(_: Event, row: CommunicationBoard) {
  router.push(`/communication-board/${row._id}`);
}

// 구분 변경 시
function onChangeDivision(event: CommunicationBoardDivision) {
  filter.value = { ... filter.value, division: event, page: 1 };
}

// 보기 타입 변경 (내 글 / 전체 글)
function changeShowType() {
  const showType = filter.value.showType === 'mine' ? 'all' : 'mine';
  filter.value = { ... filter.value, showType, page: 1 };
}
</script>

<style lang="scss" scoped>

</style>
