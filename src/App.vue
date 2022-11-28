<script setup lang="ts">
  import AuthModal from '@/components/AuthModal/AuthModal.vue';
  import AccountVerificationModal from '@/components/AccountVerificationModal/AccountVerificationModal.vue';
  import AppHeader from '@/components/Header/Header.vue';
  import AppFooter from '@/components/Footer/Footer.vue';
  import FollowsSideDrawer from '@/components/FollowsSideDrawer/FollowsSideDrawer.vue';
  import FlashToast from '@/components/ui_elements/FlashToast.vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useCoreModalStore } from '@/stores/useCoreModalStore';
  import { useFlashToastStore } from '@/stores/useFlashToastStore';
  import { useFollowsStore } from '@/stores/useFollowsStore';
  import { usePusherStore } from '@/stores/usePusherStore';
  import { useMessagesStore } from '@/stores/useMessagesStore';
  import { onMounted, watch } from 'vue';
  import { RouterView } from 'vue-router'

  const { autoLogin, getIsLoggedIn, getAuthToken, getUserData } = useAuthStore();
  const { isAuthModalShown, closeAuthModal, getIsEmailVerifyModalShown, closeEmailVerifyModal, openEmailVerifyModal } = useCoreModalStore();
  const { getIsFlashToastOpen, getMessageType, getMessageText, closeFlashToast } = useFlashToastStore();
  const { getFollowDrawerIsOpen } = useFollowsStore();
  const { getPusherInstance, createPusherInstance } = usePusherStore();
  const { addIncomingMessage, fetchLatestMessages } = useMessagesStore();

  const initPusher = () => {

    if(getIsLoggedIn.value){
      createPusherInstance(getAuthToken.value, getUserData.user_id!);

      getPusherInstance.channel.bind('new-message', (data: any) => {
 
        addIncomingMessage(data);

      });
    }

  }

  watch(getIsLoggedIn, (value: boolean) => {

    if(value === true){
      initPusher();
      fetchLatestMessages();
    }

  });


  onMounted(() => {
    const accountStatus = autoLogin();
    if(accountStatus === 'NOT_VERIFIED'){
      openEmailVerifyModal();
    }
    initPusher();
  });

</script>

<template>
    <flash-toast :is-open="getIsFlashToastOpen" :message-type="getMessageType" :message-text="getMessageText" @close-toast="closeFlashToast" />
    <auth-modal :is-open="isAuthModalShown" @close-modal="closeAuthModal" />
    <account-verification-modal :is-open="getIsEmailVerifyModalShown" @close-modal="closeEmailVerifyModal" />
    <follows-side-drawer v-if="getIsLoggedIn && getFollowDrawerIsOpen" />
    <app-header />
    <div class="view">
      <RouterView />
    </div>
    <app-footer />
</template>

<style lang="scss" scoped>
    .view{
      min-height:70vh;
    }
</style>
