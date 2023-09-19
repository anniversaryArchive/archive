<template>
  <q-layout view="lHh LpR lFf" container class="rounded-borders">
    <q-drawer :modelValue="true" :width="70"
      :breakpoint="700" side="left" class="flex flex-col shadow-lg">
      <div class="p-2">
        <img src="@/assets/images/logo.png" alt="로고" />
      </div>
      <div class="flex-1">
        <router-link v-for="menu in menus"
          :to="menu.to"
          class="block py-3 text-center"
          :class="menu.to === currentPath ? 'bg-primary text-white' : 'hover:text-primary'">
          <div>
            <q-icon :name="menu.icon" size="sm" />
          </div>
          <div class="mt-1 text-xs">
            {{ menu.label }}
          </div>
        </router-link>
      </div>

      <div class="py-4 text-center text-gray-500 border-t border-gray-300 cursor-pointer hover:text-gray-700">
        <div v-if="loggedIn" @click="onClickLogoutBtn">
          <q-icon name="logout" size="sm" />
          <div class="mt-1 text-xs text-center text-gray-600">로그아웃</div>
        </div>
        <div v-else @click="onClickLoginBtn">
          <q-icon name="person" size="sm" />
          <div class="mt-1 text-xs text-center text-gray-600">로그인</div>
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <q-page>
        <div id="troublemaker" class="bg-[#fff] h-screen mt-[-3.5rem] pt-14">
          <slot />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>

  <SignInDialog :show="isOpenSignInDialog"
    @close="() => { isOpenSignInDialog = false; }" />
</template>

<script setup lang="ts">
import { onBeforeMount, ComputedRef, computed, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import SignInDialog from "@/dialogs/SignInDialog.vue"

interface Menu {
  icon: string;
  label: string;
  to: string;
}

const route = useRoute();
const userStore = useUserStore();

const currentPath: ComputedRef<string> = computed(() => route.path);
const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const menus: ComptuedRef<Menu[]> = computed(() => {
  let menus = [
    { icon: 'map', label: '맵', to: '/cafeMap' } as Menu,
    { icon: 'favorite', label: '즐겨찾기', to: '/favorite' } as Menu,
    { icon: 'forum', label: '소통창구', to: '/communication-board' } as Menu,
  ];
  // 어드민인 경우에만 어드민 메뉴 추가
  if (userStore.isAdmin) {
    menus = [...menus, { icon: 'admin_panel_settings', label: '어드민', to: '/admin' } as Menu];
  }
  return menus;
});

const isOpenSignInDialog: Ref<boolean> = ref(false); // SignInDialog(로그인) show 여부

function onClickLoginBtn() {
  isOpenSignInDialog.value = true;
}

function onClickLogoutBtn() {
  userStore.doLogout();
}
</script>

<style scoped>

</style>
