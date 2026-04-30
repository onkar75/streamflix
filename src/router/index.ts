import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/shows/:id',
      name: 'show-details',
      component: () => import('@/pages/ShowDetailsPage.vue'),
      props: true,
    },
  ],
});

export default router;
