<template>
  <div class="flex flex-col justify-center h-full">
    <div class="flex flex-col w-4/5 p-10 m-auto bg-white rounded h-4/5">
      <header class="flex pb-4 border-b border-gray-400">
        <div class="flex-1 text-2xl font-bold">소통창구</div>
        <!-- 글쓰기 버튼 : 로그인한 유저에게만 보인다. -->
        <div v-if="loggedIn">
          <router-link to="/communication-board/create"
            class="px-4 py-1 border border-gray-300 rounded hover:bg-gray-200">글쓰기</router-link>
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
            v-model="currentPage"
            direction-links
            :max="maxPage"
            @update:model-value="onChangePage" />
        </div>
      </footer>
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

// pagination 관련 변수
const currentPage: Ref<number> = ref(1);
const total: Ref<number> = ref(0);
const perPage: number = 10;
const maxPage: ComputedRef<number> = computed(() => Math.ceil(total.value / perPage));

const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const communicationBoards: Ref<CommnunicationBoard[]> = ref([]);

onBeforeMount(() => getCommunicationBoards());

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

// 페이지 변경 시
function onChangePage(_) {
  getCommunicationBoards();
}

// Table Row 클릭 시
function onClick(_, row) {
  router.push(`/communication-board/${row._id}`);
}
</script>

<style lang="scss" scoped>

</style>
