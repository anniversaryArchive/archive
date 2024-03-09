<template>
  <div class="flex flex-col justify-center h-full">
    <div class="flex flex-col my-auto bg-white rounded md:m-auto md:p-10 h-4/5 md:w-4/5">
      <header class="px-8">
        <div class="text-2xl font-extrabold text-center text-primary">소통창구</div>

        <div class="flex justify-between pb-4 mt-4 border-b border-gray-400 md:!justify-end md:mt-0">
          <!-- 구분 Filter -->
          <div class="w-40 text-lg font-extrabold text-center">
            <q-select
              :model-value="filter.division"
              :options="divisionOptions"
              :option-label="(opt: CommunicationBoardDivision) => DIVISION_LABEL[opt] || opt"
              @update:model-value="onChangeDivision"
              class="mr-4 division-filter"
            ></q-select>
          </div>

          <!-- 내 글 보기 / 전체 글 보기 -->
          <div v-if="loggedIn" class="flex flex-col justify-center">
            <button
              class="w-32 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
              @click="changeShowType"
            >
              {{ filter.showType === 'mine' ? '전체 글 보기' : '내 글 보기' }}
            </button>
          </div>
        </div>
      </header>

      <div class="px-8 md:flex-1">
        <!-- 번호 / 분류 / 제목 / 날짜 / 작성자 -->
        <q-table
          row-key="_id"
          hide-pagination
          flat
          :rows="communicationBoards"
          :columns="columns"
          :pagination.sync="{ rowsPerPage: perPage }"
          @row-click="onClick"
          class="flex-1"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div v-html="props.value" />
            </q-td>
          </template>
        </q-table>
      </div>

      <footer class="relative mx-8 mt-4 md:mt-0">
        <div class="justify-center mt-4 md:row q-mt-md">
          <q-pagination
            :model-value="filter.page"
            direction-links
            :max="maxPage"
            @update:model-value="onChangePage"
            class="justify-center"
          />
          <!-- 글쓰기 버튼 : 로그인한 유저에게만 보인다. -->
          <div class="bottom-0 right-0 block text-right md:inline-block md:absolute">
            <router-link
              v-if="loggedIn"
              to="/communication-board/create"
              class="inline-block px-4 py-2 mt-2 text-center text-gray-600 border border-gray-300 rounded md:w-32 hover:bg-gray-200 md:mt-0"
            >
              글쓰기
            </router-link>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, computed, ComputedRef, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { query } from '@/composables/graphqlUtils';
import { CommunicationBoard, CommunicationBoardDivision } from '@/types/CommunicationBoard';
import { useUserStore } from '@/stores/user';
import { TABLE_COLUMNS, DIVISION_OPTIONS, DIVISION_LABEL, MOBILE_TABLE_COLUMNS } from './data';

import getCommunicationBoardsQuery from '@/graphql/getCommunicationBoards.query.gql';

type ShowType = 'mine' | 'all';
interface Filter {
  [key: string]: any;
  division?: string;
  showType: ShowType;
  page: number;
}

const $q = useQuasar();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// pagination 관련 변수
const total: Ref<number> = ref(0);
const perPage: number = 5;
const maxPage: ComputedRef<number> = computed(() => Math.ceil(total.value / perPage));

const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const communicationBoards: Ref<CommunicationBoard[]> = ref([]);

const noneDivision = '구분 선택';
const divisionOptions: ComputedRef<(CommunicationBoardDivision | '구분 선택')[]> = computed(() => {
  return [noneDivision, ...DIVISION_OPTIONS];
});
const filter: Ref<Filter> = ref({ division: noneDivision, showType: 'all' as ShowType, page: 1 });

const isMobile: ComputedRef<boolean> = computed(() => $q.screen.sm || $q.screen.xs);

const columns = computed(() => (isMobile.value ? MOBILE_TABLE_COLUMNS : TABLE_COLUMNS));

// Filter가 변경될 떄마다 route를 replace해주고, CommunicationBoard data를 가져온다.
watch(filter, () => {
  router.replace({ name: 'CommunicationBoard', query: { ...filter.value } });
  getCommunicationBoards();
});

onBeforeMount(() => initialize());

function initialize() {
  for (const key of ['division', 'showType', 'page']) {
    if (!route.query[key]) {
      continue;
    }
    filter.value[key] = key === 'page' ? Number(route.query[key]) : route.query[key];
  }
  getCommunicationBoards();
}

function getCommunicationBoards() {
  const flds: Record<string, any> = {};
  if (filter.value.division !== noneDivision) {
    flds.division = filter.value.division;
  }
  if (filter.value.showType === 'mine') {
    flds.author = userStore.id;
  }
  query(
    getCommunicationBoardsQuery,
    {
      page: filter.value.page - 1,
      perPage,
      filter: { flds },
    },
    false,
  ).then(({ data, error, execute }) => {
    if (!data.value?.communicationBoard) {
      return;
    }
    communicationBoards.value = data.value.communicationBoard.data || [];
    total.value = data.value.communicationBoard.total || 0;
  });
}

// 페이지 변경 시
function onChangePage(page: number) {
  filter.value = { ...filter.value, page };
}

// Table Row 클릭 시
function onClick(_: Event, row: CommunicationBoard) {
  router.push(`/communication-board/${row._id}`);
}

// 구분 변경 시
function onChangeDivision(event: CommunicationBoardDivision) {
  filter.value = { ...filter.value, division: event, page: 1 };
}

// 보기 타입 변경 (내 글 / 전체 글)
function changeShowType() {
  const showType = filter.value.showType === 'mine' ? 'all' : 'mine';
  filter.value = { ...filter.value, showType, page: 1 };
}
</script>

<style lang="scss">
.division-filter {
  .q-field__control,
  .q-field__native,
  .q-field__append {
    height: 40px;
    min-height: auto;
  }
}
</style>
