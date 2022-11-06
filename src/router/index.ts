import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/useAuthStore';

import HomeView from '@/views/Home.vue';
import ProfileView from '@/views/Profile.vue';
import EditProfileView from '@/views/EditProfile.vue';

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
    }, 
    {
      path: '/user/edit-profile', 
      name: 'edit-profile', 
      component: EditProfileView, 
      meta: {
        isAuthRequired: true
      }
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
