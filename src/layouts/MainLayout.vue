<template>
  <q-layout view="lHh LpR lFf" container class="rounded-borders">
    <!-- Side Bar -->
    <q-drawer v-if="!isMobile" :modelValue="true" :width="70"
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

    <!-- 하단 Tabs -->
    <q-footer v-if="isMobile" class="grid shadow-[0px_-5px_20px] shadow-slate-300 grid-cols-5">
      <template v-for="(menu, index) in menus">
        <router-link :to="menu.to"
          class="block py-2 text-center"
          :class="menu.to === currentPath ? 'bg-primary text-white' : 'bg-white text-primary hover:text-primary'">
          <div>
            <q-icon :name="menu.icon" size="sm" />
          </div>
          <div class="mt-1 text-xs">
            {{ menu.label }}
          </div>
        </router-link>

        <div v-if="index === 1" class="flex flex-col text-center bg-white">
          <img src="@/assets/images/logo.png" alt="로고"
            class="w-2/3 m-auto" />
        </div>
      </template>

      <div class="flex flex-col justify-center text-center text-gray-600 bg-white"
        @click="loggedIn ? onClickLogoutBtn() : onClickLoginBtn()">
        <q-icon name="logout" size="sm" class="mx-auto" />
        <div class="justify-center mt-1 text-xs text-center">{{ loggedIn ? '로그아웃' : '로그인' }}</div>
      </div>
    </q-footer>
  </q-layout>

  <SignInDialog :show="isOpenSignInDialog"
    @close="() => { isOpenSignInDialog = false; }" />
</template>

<script setup lang="ts">
import { onBeforeMount, ComputedRef, computed, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores/user';
import SignInDialog from '@/dialogs/SignInDialog.vue';

interface Menu {
  icon: string;
  label: string;
  to: string;
}

const $q = useQuasar();
const route = useRoute();
const userStore = useUserStore();

const isMobile: ComputedRef<boolean> = computed(() => $q.screen.xs);
const currentPath: ComputedRef<string> = computed(() => route.path);
const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
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
