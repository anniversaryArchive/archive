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

function onClickItem() {
  emit('click');
}

async function onClickFavoriteIcon() {
  let success: boolean = false;
  try {
    if (archive.favorite) {
      success = await (archive.favorite ? doRemoveFavorite() : doCreateFavorite());
    } else {
      success = await doCreateFavorite();
    }
    if (!success) { return; }
    props.archive.favorite = !props.archive.favorite;
  } catch (_) {}
}

async function doCreateFavorite(): Promise<boolean> {
  try {
    const { data } = await mutate(createFavorite, { archive: archive.value._id });
    return data.favorite?._id && true;
  } catch (_) {}
  return false;
}

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