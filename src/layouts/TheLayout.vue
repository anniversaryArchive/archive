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

const route = useRoute();

const layout: ComputedRef<component | null> = computed(() => {
  switch (route.meta.layout) {
    case 'MainLayout': return MainLayout;
    case 'AdminLayout': return AdminLayout;
  }
  return null;
});

</script>

<style scoped>

</style>