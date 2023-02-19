import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    meta: {title: 'Home'},
    path: '/',
    component: () => import('@/pages/SelectGroup.vue'),
  },
  {
    meta: {title: '관리자 화면'},
    path: '/admin',
    component: () => import('@/pages/Admin/Admin.vue'),
  },
  {
    meta: {title: '그룹 추가 화면'},
    path: '/admin/group',
    component: () => import('@/pages/Admin/Group.vue'),
  },
  {
    meta: {title: '아티스트 추가 화면'},
    path: '/admin/artists',
    component: () => import('@/pages/Admin/Artists.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});