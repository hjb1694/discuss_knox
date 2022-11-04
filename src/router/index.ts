import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/Home.vue';
import ProfileView from '@/views/Profile.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      name: 'home', 
      component: HomeView
    }, 
    {
      path: '/user/profile/:username', 
      name: 'profile', 
      component: ProfileView
    }
  ]
})

export default router
