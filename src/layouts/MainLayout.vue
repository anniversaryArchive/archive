<template>
  <q-layout view="lHh LpR lFf" container class="rounded-borders">
    <!-- Side Bar -->
    <q-drawer v-if="!isMobile" :modelValue="true" :width="70"
      :breakpoint="700" side="left" class="flex flex-col shadow-lg">
      <div class="p-2">
        <img src="@/assets/images/logo.png" alt="로고" />
      </div>

      <div class="flex-1">
        <Tabs />
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
        <div id="troublemaker" class="bg-[#fff] h-screen mt-[-3.5rem] pt-14 overflow-y-hidden">
          <slot />
        </div>
      </q-page>
    </q-page-container>

    <!-- 하단 Tabs -->
    <q-footer v-if="isMobile">
      <Tabs @login="onClickLoginBtn" @logout="onClickLogoutBtn" />
    </q-footer>
  </q-layout>

  <SignInDialog :show="isOpenSignInDialog"
    @close="() => { isOpenSignInDialog = false; }" />
</template>

<script setup lang="ts">
import { onBeforeMount, ComputedRef, computed, ref, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores/user';
import SignInDialog from '@/dialogs/SignInDialog.vue';
import Tabs from '@/components/Tabs.vue';

const $q = useQuasar();
const userStore = useUserStore();

const isMobile: ComputedRef<boolean> = computed(() => $q.screen.sm || $q.screen.xs);
const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);

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
