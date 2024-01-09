<template>
  <component v-if="layout" :is="layout">
    <slot />
  </component>
  <slot v-else />
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './MainLayout.vue';
import AdminLayout from './AdminLayout.vue';
import MapLayout from './MapLayout.vue';

const route = useRoute();

const layout: ComputedRef<any> = computed(() => {
  switch (route.meta.layout) {
    case 'MainLayout':
      return MainLayout;
    case 'AdminLayout':
      return AdminLayout;
    case 'MapLayout':
      return MapLayout;
  }
  return null;
});
</script>

<style scoped></style>
