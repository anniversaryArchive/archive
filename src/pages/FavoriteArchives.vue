<template>
  <div>
    <div v-for="archive in archives">
      {{ archive.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { query } from '@/composables/graphqlUtils';
import getFavoritesGroup from '@/graphql/getFavoritesGroupItem.query.gql';
import { Archive } from '@/types/Archive';

const route = useRoute();

const archives: Ref<Archive> = ref([]);

onBeforeMount(() => {
  const id = route.params.id;
  getItem(id);
});

function getItem(id: string) {
  query(getFavoritesGroup, { id }, false).then(({ data, error }) => {
    archives.value = data.value.favoriteGroup?.archives || [];
  });
}
</script>

<style scoped></style>
