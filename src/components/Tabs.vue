<template>
  <div :class="{ 'grid shadow-[0px_-5px_20px] shadow-slate-300 grid-cols-5': isMobile }">
    <template v-for="(menu, index) in menus">
      <router-link
        :to="menu.to"
        class="tab-link flex flex-col justify-center text-center transition-colors duration-300 bg-white"
        @mouseover="menu.hover = true"
        :class="currentPath.includes(menu.to) ? 'text-primary' : 'text-muted'">
        <div class="tab-icon">
          <component :is="componentLoader(menu.icon)" :is-active="currentPath.includes(menu.to)" :is-hover="menu.hover" />
        </div>
        <div class="mt-1 text-xs">
          {{ menu.label }}
        </div>
      </router-link>

      <div v-if="isMobile && index === 1" class="flex flex-col text-center bg-white">
        <img src="@/assets/images/svgs/logo.svg" class="w-2/3 m-auto" alt="로고" />
      </div>
    </template>
    <div
      v-if="isMobile"
      class="mobile flex flex-col justify-center text-center text-gray-600 bg-white"
      @click="onClickBtn(loggedIn ? 'logout' : 'login')"
    >
      <!-- <q-icon name="logout" :size="'30px'" class="mx-auto mt-auto mb-1" /> -->
      <Login :is-active="!loggedIn" />
      <div class="justify-center mt-1 text-xs text-center">{{ loggedIn ? "로그아웃" : "로그인" }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useUserStore } from "@/stores/user";
import Favorite from '@/components/icon/Favorite.vue';
import Map from '@/components/icon/Map.vue';
import Forum from '@/components/icon/Forum.vue';
import Admin from '@/components/icon/Admin.vue';
import Login from '@/components/icon/Login.vue';

interface Menu {
  icon: string;
  label: string;
  to: string;
  hover: boolean
}

const emit = defineEmits(["login", "logout"]);

const $q = useQuasar();
const route = useRoute();
const userStore = useUserStore();

const isMobile: ComputedRef<boolean> = computed(() => $q.screen.sm || $q.screen.xs);
const loggedIn: ComputedRef<boolean> = computed(() => userStore.loggedIn);
const currentPath: ComputedRef<string> = computed(() => {
  return route.path;
});

const menus: ComputedRef<Menu[]> = computed(() => {
  let menus = [
    { icon: "map", label: "맵", to: "/cafe-map", hover: false } as Menu,
    { icon: "favorite", label: "즐겨찾기", to: "/favorite", hover: false } as Menu,
    { icon: "forum", label: "소통창구", to: "/communication-board", hover: false } as Menu,
  ];
  // 어드민인 경우에만 어드민 메뉴 추가
  if (!isMobile.value && userStore.isAdmin) {
    menus = [...menus, { icon: "admin_panel_settings", label: "어드민", to: "/admin/group" } as Menu];
  }
  return menus;
});

function onClickBtn(type: "login" | "logout") {
  emit(type);
}

function componentLoader (type: string) {
  switch (type) {
    case 'favorite' :
      return Favorite;
    case 'map' :
      return Map;
    case 'forum':
      return Forum;
    case 'admin_panel_settings' :
      return Admin;
  }
}

</script>

<style lang="scss" scoped>
.tab-link {
  .tab-icon {
    margin: auto;
  }
}

.tab-link:first-child,
.tab-link+.tab-link {
  padding-top: 30px;
}

.tab-link:hover {
  .mt-1 {
    color: #4285F4;
  }
}

@media (max-width: 959px) {
  .tab-link:first-child,
  .tab-link+.tab-link {
    padding-top: 0;
  }
  .tab-link {
    .tab-icon {
      margin: 15px auto 4px;
    }
  }
  .mobile {
    svg {
      margin: 15px auto 4px;
    }
  }
}

</style>
