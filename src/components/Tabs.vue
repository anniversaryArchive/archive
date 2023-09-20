<template>
  <div :class="{ 'grid shadow-[0px_-5px_20px] shadow-slate-300 grid-cols-5': isMobile }">
    <template v-for="(menu, index) in menus">
      <router-link :to="menu.to"
        class="flex flex-col justify-center py-2 text-center"
        :class="menu.to === currentPath ? 'bg-primary text-white' : 'bg-white text-primary hover:text-primary'">
        <div>
          <q-icon :name="menu.icon" size="sm" />
        </div>
        <div class="mt-1 text-xs">
          {{ menu.label }}
        </div>
      </router-link>

      <div v-if="isMobile && index === 1" class="flex flex-col text-center bg-white">
        <img src="@/assets/images/logo.png" alt="로고"
          class="w-2/3 m-auto" />
      </div>
    </template>
    <div v-if="isMobile" class="flex flex-col justify-center text-center text-gray-600 bg-white"
      @click="onClickBtn(loggedIn ? 'logout' : 'login')">
      <q-icon name="logout" size="sm" class="mx-auto" />
      <div class="justify-center mt-1 text-xs text-center">{{ loggedIn ? '로그아웃' : '로그인' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores/user';

interface Menu {
  icon: string;
  label: string;
  to: string;
}

const emit = defineEmits(['login', 'logout']);

const $q = useQuasar();
const route = useRoute();
const userStore = useUserStore();

const isMobile: ComputedRef<boolean> = computed(() => $q.screen.sm || $q.screen.xs);
const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const currentPath: ComputedRef<string> = computed(() => route.path);

const menus: ComputedRef<Menu[]> = computed(() => {
  let menus = [
    { icon: 'map', label: '맵', to: '/cafeMap' } as Menu,
    { icon: 'favorite', label: '즐겨찾기', to: '/favorite' } as Menu,
    { icon: 'forum', label: '소통창구', to: '/communication-board' } as Menu,
  ];
  // 어드민인 경우에만 어드민 메뉴 추가
  if (!isMobile.value && userStore.isAdmin) {
    menus = [...menus, { icon: 'admin_panel_settings', label: '어드민', to: '/admin/group' } as Menu];
  }
  return menus;
});

function onClickBtn(type: 'login' | 'logout') {
  emit(type);
}

</script>

<style scoped>

</style>