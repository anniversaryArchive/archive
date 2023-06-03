<template>
  <q-item class="archive-item" clickable
    @click="onClickItem">
    <q-item-section>
      <div class="grid grid-flow-row-dense grid-cols-2">
        <q-item-label class="overflow-hidden leading-7 text-ellipsis whitespace-nowrap">{{archive.themeName}}</q-item-label>
        <q-button class="text-right" @click="onClickFavoriteIcon">
          <q-icon :name="`favorite${!archive.favorite && '_outline'}`"
            class="inline-block" />
        </q-button>
      </div>
      <q-item-label class="text-xs leading-5 text-[#767676]">{{archive.organizer}}</q-item-label>
      <q-item-label class="text-sm leading-6 text-[#767676]">{{archive.address}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { Archive } from '@/types/Archive';
import { mutate } from '@/composables/graphqlUtils';

import createFavorite from '@/graphql/createFavorite.mutate.gql';
import removeFavorite from '@/graphql/removeFavorite.mutate.gql';

interface Props {
  archive: Archive;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['click']);

const archive: ComputedRef<Archive> = computed(() => props.archive);

// 카페 아이템 클릭 시 
function onClickItem() {
  emit('click');
}

// 즐겨찾기 아이콘 클릭 시, 즐겨찾기 여부를 확인하여 doCreateFavorite / doRemoveFavorite 함수를 호출해준다.
async function onClickFavoriteIcon() {
  let success: boolean = false;
  try {
    if (archive.value.favorite) {
      success = await doRemoveFavorite();
    } else {
      success = await doCreateFavorite();
    }
    if (!success) { return; }
    props.archive.favorite = !props.archive.favorite;
  } catch (_) {}
}

// 즐겨찾기 추가 
async function doCreateFavorite(): Promise<boolean> {
  try {
    const { data } = await mutate(createFavorite, { archive: archive.value._id });
    return data.favorite?._id && true;
  } catch (_) {}
  return false;
}

// 즐겨찾기 제거 
async function doRemoveFavorite(): Promise<boolean> {
  try {
    const { data } = await mutate(removeFavorite, { archive: archive.value._id });
    return data.success && true;
  } catch (_) {}
  return false;
}
</script>

<style scoped>

</style>