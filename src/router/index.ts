import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/pages/Admin/Admin.vue'),
  },
  {
    path: '/admin/group',
    component: () => import('@/pages/Admin/Group.vue'),
  },
  {
    path: '/admin/artists',
    component: () => import('@/pages/Admin/Artists.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
