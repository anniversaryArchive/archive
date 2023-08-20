<template>
  <q-layout view="hHh LpR fFf" container class="rounded-borders">
    <LayoutHeader />
    <q-page-container>
      <q-page>
        <div id="troublemaker" class="bg-[#DDF1FF] h-screen mt-[-3.5rem] pt-14">
          <slot />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import LayoutHeader from '@/layouts/LayoutHeader.vue';
</script>

<style scoped>

</style>