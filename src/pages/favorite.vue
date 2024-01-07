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
        @click="onClickFavoriteGroup(item._id)"
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
            <q-input v-model="createFavoriteGroup.title" placeholder="즐겨찾기명" />
          </div>

          <div class="mt-4">
            <label class="font-bold">색상 선택</label>
            <q-color v-model="createFavoriteGroup.color" class="mx-auto mt-2 w-[15rem]" no-header no-footer />
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

import { useMapStore } from '@/stores/map';
import BottomDialog from '@/dialogs/BottomDialog.vue';
import { query, mutate } from '@/composables/graphqlUtils';
import getFavoriteGroupList from '@/graphql/getFavoriteGroupList.query.gql';
import createFavoriteGroupMutate from '@/graphql/createFavoriteGroup.mutate.gql';
import { Archive } from '@/types/Archive';
import { FavoriteGroup } from '@/types/FavoriteGroup';

const router = useRouter();
const mapStore = useMapStore();

const list: Ref<FavoriteGroup[]> = ref([]);
const createFavoriteGroup: Ref<{ title: string; color?: string }> = ref({ title: '' });
const isShowCreateFavoriteDialog = ref(false);

watch(list, () => {
  let archives: Archive[] = [];
  for (const item of list.value) {
    if (item.archives) {
      archives = archives.concat(item.archives.map((archive: Archive) => archive));
    }
  }

  mapStore.setMarkerData(archives);
});

onBeforeMount(() => {
  getList();
});

// favorite group list 가져오기
function getList() {
  query(getFavoriteGroupList, {}, false).then(({ data }) => {
    list.value = data.value?.list || [];
  });
}

// favorite group 생성 bottom dialog hide 함수
function hideCreateFavoriteDialog() {
  isShowCreateFavoriteDialog.value = false;
}

// create favorite group 함수
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

// 즐겨찾기 그룹 클릭 시
function onClickFavoriteGroup(id: string) {
  router.push(`/favorite/${id}`);
}
</script>

<style scoped></style>
