<template>
  <q-layout view="lHh lpr lFf" container style="height: 61px" class="rounded-borders">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>
        <q-toolbar-title class="toolbar-title">
          <span class="layout-title" @click="$router.push('/')" style="cursor: pointer">ARCHIVE</span>
        </q-toolbar-title>

        <q-space />

        <div v-if="$q.screen.sizes.md <= $q.screen.width">
          <ul class="menu-ul">
            <li>
              <q-btn v-if="loggedIn" @click="doLogout">로그아웃</q-btn>
              <q-btn v-else @click="doLogin">로그인</q-btn>
            </li>
            <li>
              <q-btn @click="$router.push('/favorite')" flat>즐겨찾기</q-btn>
            </li>
            <li>
              <q-btn flat>소통창구</q-btn>
            </li>
          </ul>
        </div>
      </q-toolbar>
    </q-header>
    <div id="signinBox" style="display: none"></div>
  </q-layout>

  <SignInDialog :show="isOpenSignInDialog"
    @close="() => { userStore.openSignInDialog = false; }" />
</template>

<script lang="ts">
import {defineComponent, ref, computed} from "vue"
import {useQuasar} from "quasar"
import {useUserStore} from "@/stores/user"
import SignInDialog from "@/dialogs/SignInDialog.vue"

export default defineComponent({
  name: "LayoutHeader.",
  components: {SignInDialog},
  setup() {
    const $q = useQuasar()
    $q.screen.setSizes({sm: 360, md: 800, lg: 1500, xl: 2000})

    const userStore = useUserStore()
    const loggedIn = computed(() => userStore.loggedIn);
    const isOpenSignInDialog = computed(() => userStore.isOpenSignInDialog);

    return {
      userStore,
      loggedIn, // 현재 로그인 여부
      isOpenSignInDialog // 로그인/회원가입 Dialog open 여부
    }
  },
  methods: {
    // 로그인 버튼 클릭 시, 로그인/회원가입 Dialog을 띄워준다
    doLogin() {
      this.userStore.openDialog('signIn');
    },
    // 로그아웃 버튼 클릭 시, userStore.doLogout을 호출하여 로그아웃을 진행한다.
    doLogout() {
      this.userStore.doLogout()
    }
  }
})
</script>

<style scoped></style>
