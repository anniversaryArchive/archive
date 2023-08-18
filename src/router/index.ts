import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from "vue-router"
import { useUserStore } from "@/stores/user"
import { computed } from "vue"

const authUser = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore()
  const loggedIn = computed(() => userStore.loggedIn)

  if (!loggedIn.value) {
    alert("로그인 후 이용 가능합니다.")
    next("/")
  } else {
    next()
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    meta: { title: "Home" },
    path: "/",
    component: () => import("@/pages/SelectGroup.vue")
  },
  {
    meta: { title: "cafeMap" },
    path: "/cafeMap",
    component: () => import("@/pages/cafeMap.vue")
  },
  {
    meta: { title: "Archive" },
    path: "/archive/:id",
    component: () => import("@/pages/ArchiveDetail.vue")
  },
  {
    meta: { title: "favorite" },
    path: "/favorite",
    beforeEnter: authUser,
    component: () => import("@/pages/favorite.vue")
  },

  {
    meta: { title: "소통 창구", layout: "MainLayout" },
    path: "/communicationBoard",
    component: () => import("@/pages/CommunicationBoard.vue")
  },
  {
    path: "/admin",
    // beforeEnter: authUser,
    children: [
      {
        path: "",
        meta: { title: "관리자 화면" },
        component: () => import("@/pages/Admin/Admin.vue")
      },
      {
        path: "group",
        meta: { title: "그룹 추가 화면" },
        component: () => import("@/pages/Admin/Group.vue")
      },
      {
        path: "artist",
        meta: { title: "아티스트 추가 화면" },
        component: () => import("@/pages/Admin/Artists.vue")
      },
      {
        path: "archive",
        meta: { title: "카페 추가 화면" },
        component: () => import("@/pages/Admin/Archive.vue")
      }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
