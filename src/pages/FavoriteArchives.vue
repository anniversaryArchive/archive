<template>
  <div>
    <q-list>
      <CafeItem v-for="archive in archives" :archive="archive" @click="onClickArchive(archive)" />
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { query } from '@/composables/graphqlUtils';
import { Archive } from '@/types/Archive';
import { useMapStore } from '@/stores/map';
import CafeItem from '@/components/CafeItem.vue';

import getFavoritesGroup from '@/graphql/getFavoritesGroupItem.query.gql';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const mapStore = useMapStore();

const archives: Ref<Archive> = ref([]);

onBeforeMount(() => {
  const id = route.params.id;
  getData(id);
});

function getData(id: string) {
  query(getFavoritesGroup, { id }, false).then(({ data, error }) => {
    archives.value = data.value.favoriteGroup?.archives || [];
    mapStore.setMarkerData(archives.value);
  });
}

// 카페 클릭 시
function onClickArchive(archive: Archive) {
  if ($q.screen.xs) {
    router.push(`/archive/${archive._id}`);
  } else {
    mapStore.setSelectedArchive(archive);
  }
}
</script>

<style scoped></style>
