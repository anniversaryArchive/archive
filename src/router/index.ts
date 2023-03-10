import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    meta: {title: 'Home'},
    path: '/',
    component: () => import('@/pages/SelectGroup.vue'),
  },
  {
    meta: {title: 'cafeMap'},
    path: '/cafeMap',
    component: () => import('@/pages/cafeMap.vue'),
  },
  {
    path: '/admin',
    children: [
      { 
        path: '', 
        meta: { title: '관리자 화면' }, 
        component: () => import('@/pages/Admin/Admin.vue'),
      }, {
        path: 'group',
        meta: { title: '그룹 추가 화면' },
        component: () => import('@/pages/Admin/Group.vue'),
      }, {
        path: 'artist',
        meta: { title: '아티스트 추가 화면' },
        component: () => import('@/pages/Admin/Artists.vue'),
      }, {
        path: 'archive',
        meta: { title: '카페 추가 화면' },
        component: () => import('@/pages/Admin/Archive.vue'),
      }
    ],
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});