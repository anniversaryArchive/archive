<template>
  <q-layout view="lhh LpR lff" container class="rounded-borders">
    <LayoutHeader>
     <template v-slot:toggle>
        <button @click="onClickMenuBtn">
          <q-icon name="menu" size="28px" />
        </button>
      </template>
    </LayoutHeader>

    <q-drawer
      v-model="showSideBar"
      :width="300"
      :breakpoint="700"
      bordered>
      <q-scroll-area class="fit">
        <router-link v-for="menu in sideMenus"
          :to="menu.to" class="block px-2 py-4 text-xl font-semibold border-b border-gray-300 hover:bg-gray-200"
          :class="{ 'text-primary': currentPath === menu.to }">
          {{ menu.label }}
        </router-link>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="pt-14">
      <q-page>
        <div id="troublemaker" class="h-screen mt-[-3.5rem] pt-14 overflow-y-auto">
          <slot />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, Ref, computed, ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import LayoutHeader from '@/layouts/LayoutHeader.vue';

const route = useRoute();

const showSideBar: Ref<boolean> = ref(false);
const sideMenus: { to: string, label: string }[] = [{
  to: '/admin/group',
  label: '그룹 관리'
}, {
  to: '/admin/artist',
  label: '아티스트 관리',
}, {
  to: '/admin/archive',
  label: '카페 관리'
}];

const currentPath: ComputedRef<string> = computed(() => route.path);

function onClickMenuBtn() {
  showSideBar.value = !showSideBar.value;
}
</script>

<style scoped>

</style>
