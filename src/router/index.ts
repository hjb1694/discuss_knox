import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/useAuthStore';

import HomeView from '@/views/Home.vue';
import ProfileView from '@/views/Profile.vue';
const EditProfileView = () => import('@/views/EditProfile.vue');
const AccountSettings = () => import('@/views/AccountSettings.vue');
const NewThread = () => import('@/views/NewThread.vue');
const Thread = () => import('@/views/Thread.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(){
    return {top: 0}
  },
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
    }, 
    {
      path: '/user/edit-profile', 
      name: 'edit-profile', 
      component: EditProfileView, 
      meta: {
        isAuthRequired: true
      }
    }, 
    {
      path: '/user/account-settings', 
      name: 'account-settings', 
      component: AccountSettings, 
      meta: {
        isAuthRequired: true
      }
    }, 
    {
      path: '/thread/new', 
      name: 'new-thread', 
      component: NewThread, 
      meta: {
        isAuthRequired: true
      }
    }, 
    {
      path: '/thread/:slug', 
      name: 'thread', 
      component: Thread
    }
  ]
});

router.beforeEach((to, from, next) => {

      const { getIsLoggedIn } = useAuthStore();

      if(to.meta.isAuthRequired){

          if(!getIsLoggedIn.value){
            console.log('not logged in');
            next({name: 'home'});
          }else{
            next();
          }

      }else{
        next();
      }


})

export default router
