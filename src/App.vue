<script setup lang="ts">
import TheLayout from '@/layouts/TheLayout.vue';
</script>

<template>
  <TheLayout>
    <router-view></router-view>
  </TheLayout>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
