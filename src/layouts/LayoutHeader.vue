<template>
  <q-layout view="lHh lpr lFf" container style="height: 61px" class="rounded-borders">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title class="text-left">
          <q-avatar>
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"> -->
          </q-avatar>
          <span class="layout-title">ARCHIVE</span>
        </q-toolbar-title>

        <q-btn v-if="!loggedIn" @click="doLogin">로그인</q-btn>
        <q-btn v-else @click="doLogout">로그아웃</q-btn>
      </q-toolbar>
    </q-header>
    <div id="signinBox" style="display: none"></div>
  </q-layout>

  <LoginDialog :show="isOpenLoginDialog"
    @close="() => { isOpenLoginDialog = false; }" />
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import LoginDialog from '@/dialogs/LoginDialog.vue';

export default defineComponent({
  name: 'LayoutHeader.',
  components: { LoginDialog },
  setup() {
    const userStore = useUserStore();
    const loggedIn = computed(() => userStore.loggedIn);

    const isOpenLoginDialog = ref(false);
    return {
      userStore,
      loggedIn,
      isOpenLoginDialog,
    };
  },
  methods: {
    async doLogin() {
      this.isOpenLoginDialog = true;
    },
    doLogout() {
      this.userStore.doLogout();
    }
  },
});
</script>

<style scoped>
  .layout-title {
    font-style: normal;
    font-weight: 900;
    font-size: 40px;
    line-height: 60px;
  }
</style>
