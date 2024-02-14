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

const requireAdmin = (_: RouteLocationNormalized, __: RouteLocationNormalized, next: NavigationGuardNext) => {
  const userStore = useUserStore();
  if (!userStore.isAdmin) { return next('/'); }
  next();
}

const routes: Array<RouteRecordRaw> = [
  {
    meta: { title: "Home" },
    path: "/",
    component: () => import("@/pages/SelectGroup.vue")
  },
  {
    meta: { title: 'cafeMap', layout: 'MapLayout' },
    path: '/cafe-map',
    component: () => import('@/pages/cafeMap.vue'),
  },
  {
    meta: { title: "Archive", layout: "MainLayout" },
    path: "/archive/:id",
    component: () => import("@/pages/ArchiveDetail.vue")
  },
  {
    meta: { title: 'favorite', layout: 'MapLayout' },
    path: '/favorite',
    beforeEnter: authUser,
    children: [
      {
        path: '',
        component: () => import('@/pages/favorite.vue'),
      },
      {
        path: ':id',
        component: () => import('@/pages/FavoriteArchives.vue'),
      },
    ],
  },

  {
    meta: { title: "소통 창구", layout: "MainLayout" },
    name: 'CommunicationBoard',
    path: "/communication-board",
    component: () => import("@/pages/CommunicationBoard/CommunicationBoard.vue")
  },
  {
    meta: { title: "소통 창구 상세", layout: "MainLayout" },
    path: "/communication-board/:id",
    component: () => import("@/pages/CommunicationBoard/communicationBoardDetail.vue")
  },
  {
    path: "/signUp",
    meta: { title: "회원가입" },
    component: () => import("@/pages/SignUp.vue"),
  },
  {
    path: '/naverOauth',
    meta: { title: "네이버 로그인" },
    component: () => import("@/pages/NaverOauth.vue"),
  },
  {
    path: "/admin",
    beforeEnter: requireAdmin,
    meta: { layout: "AdminLayout" },
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
  },
  {
    path: "/test",
    meta: { title: "TEST 화면" },
    component: () => import("@/pages/Test.vue")
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
