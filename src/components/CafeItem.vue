<template>
  <q-item class="archive-item" clickable
    @click="onClickItem">
    <q-item-section>
      <q-item-label class="overflow-hidden leading-7 text-ellipsis whitespace-nowrap">{{archive.themeName}}</q-item-label>
      <q-item-label class="text-xs leading-5 text-[#767676]">{{archive.organizer}}</q-item-label>
      <q-item-label class="text-sm leading-6 text-[#767676]">{{archive.address}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Archive } from '@/types/Archive';

interface Props {
  archive: Archive;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['click']);

function onClickItem() {
  emit('click');
}
</script>

<style scoped>

</style>