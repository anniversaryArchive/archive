<template>
  <ul>
    <li class="flex px-4 py-4 font-semibold border-b border-gray-300" @click="isShowCreateFavoriteDialog = true">
      <q-icon name="add_circle_outline" size="sm" class="my-auto text-gray-300" />
      <div class="flex-1 my-auto ml-2 text-gray-600">새 즐겨찾기 만들기</div>
    </li>

    <li
      v-for="item in list"
      class="flex flex-wrap px-4 py-4 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
      @click="emit('click', item._id)"
    >
      <div class="flex flex-1 my-auto">
        <div
          class="flex flex-col justify-center w-5 h-5 mr-2 text-center rounded-full"
          :style="`background-color: ${item.color}`"
        >
          <q-icon name="favorite" class="m-auto text-white" />
        </div>
        <div class="font-semibold">{{ item.title }}</div>
      </div>

      <span v-if="selectable">
        <q-checkbox :modelValue="item.selected || false" @update:modelValue="item.selected = $event" />
      </span>
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
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';

import BottomDialog from '@/dialogs/BottomDialog.vue';
import { useFavoriteGroupStore } from '@/stores/favoriteGroup';

interface Props {
  selectable?: boolean;
  selected?: { _id: string }[];
}

const props = withDefaults(defineProps<Props>(), { selectable: false });
const emit = defineEmits(['click']);

const favoriteGroupStore = useFavoriteGroupStore();

const list = computed(() => {
  if (!props.selectable) return favoriteGroupStore.list;
  const list = [...favoriteGroupStore.list];
  return list.map(item => {
    item.selected = props.selected?.some(({ _id }) => item._id === _id);
    return item;
  });
});
const createFavoriteGroup: Ref<{ title: string; color?: string }> = ref({ title: '' });

const isShowCreateFavoriteDialog = ref(false);

// favorite group 생성 bottom dialog hide 함수
function hideCreateFavoriteDialog() {
  isShowCreateFavoriteDialog.value = false;
}

// create favorite group 함수
async function create() {
  isShowCreateFavoriteDialog.value = false;
  try {
    await favoriteGroupStore.createFavoriteGroup(createFavoriteGroup.value);
  } catch (error) {
    console.error(error);
  } finally {
    createFavoriteGroup.value = { title: '' };
  }
}
</script>

<style scoped></style>