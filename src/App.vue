<script setup lang="ts">
  import authModal from '@/components/AuthModal/AuthModal.vue';
  import accountVerificationModal from '@/components/AccountVerificationModal/AccountVerificationModal.vue';
  import appHeader from '@/components/Header/Header.vue';
  import followsSideDrawer from '@/components/FollowsSideDrawer/FollowsSideDrawer.vue';
  import flashToast from '@/components/ui_elements/FlashToast.vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useCoreModalStore } from '@/stores/useCoreModalStore';
  import { useFlashToastStore } from '@/stores/useFlashToastStore';
  import { useFollowsStore } from '@/stores/useFollowsStore';
  import { computed, onMounted } from 'vue';
  import { RouterView } from 'vue-router'

  const { autoLogin, getIsLoggedIn } = useAuthStore();
  const { isAuthModalShown, closeAuthModal, getIsEmailVerifyModalShown, closeEmailVerifyModal, openEmailVerifyModal } = useCoreModalStore();
  const { getIsFlashToastOpen, getMessageType, getMessageText, closeFlashToast } = useFlashToastStore();
  const { getFollowDrawerIsOpen } = useFollowsStore();


  onMounted(() => {
    const accountStatus = autoLogin();
    if(accountStatus === 'NOT_VERIFIED'){
      openEmailVerifyModal();
    }
  });

</script>

<template>
    <flash-toast :is-open="getIsFlashToastOpen" :message-type="getMessageType" :message-text="getMessageText" @close-toast="closeFlashToast" />
    <auth-modal :is-open="isAuthModalShown" @close-modal="closeAuthModal" />
    <account-verification-modal :is-open="getIsEmailVerifyModalShown" @close-modal="closeEmailVerifyModal" />
    <follows-side-drawer v-if="getIsLoggedIn && getFollowDrawerIsOpen" />
    <app-header />
    <RouterView />
</template>

<style lang="scss" scoped>

</style>
