<script setup lang="ts">
  import authModal from '@/components/AuthModal/AuthModal.vue';
  import accountVerificationModal from '@/components/AccountVerificationModal/AccountVerificationModal.vue';
  import appHeader from '@/components/Header/Header.vue';
  import { useAuthStore } from '@/stores/useAuthStore';
  import { useCoreModalStore } from '@/stores/useCoreModalStore';
  import { computed, onMounted } from 'vue';

  const { autoLogin } = useAuthStore();
  const { isAuthModalShown, closeAuthModal, getIsEmailVerifyModalShown, closeEmailVerifyModal, openEmailVerifyModal } = useCoreModalStore();

  onMounted(() => {
    const accountStatus = autoLogin();
    if(accountStatus === 'NOT_VERIFIED'){
      openEmailVerifyModal();
    }
  });

</script>

<template>
    <auth-modal :is-open="isAuthModalShown" @close-modal="closeAuthModal" />
    <account-verification-modal :is-open="getIsEmailVerifyModalShown" @close-modal="closeEmailVerifyModal" />
    <app-header />
  
</template>

<style lang="scss" scoped>

</style>
