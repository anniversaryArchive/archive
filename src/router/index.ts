import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/admin',
    component: () => import('../pages/Admin.vue'),
  },
  {
    path: '/admin/group',
    component: () => import('../pages/Group.vue'),
  },
  {
    path: '/admin/artists',
    component: () => import('../pages/Artists.vue'),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
