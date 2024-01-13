<template>
  <div class="h-screen">
    <h6 class="font-bold text-center">즐겨찾기 ({{ list.length || 0 }})</h6>

    <FavoriteGroupList @click="onClickFavoriteGroup" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useMapStore } from '@/stores/map';
import { useFavoriteGroupStore } from '@/stores/favoriteGroup';
import { Archive } from '@/types/Archive';
import FavoriteGroupList from '@/components/FavoriteGroupList.vue';

const router = useRouter();
const mapStore = useMapStore();
const favoriteGroupStore = useFavoriteGroupStore();

const list = computed(() => favoriteGroupStore.list);

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
  favoriteGroupStore.getFavoriteGroupList();
}

// 즐겨찾기 그룹 클릭 시
function onClickFavoriteGroup(id: string) {
  router.push(`/favorite/${id}`);
}
</script>

<style scoped></style>
