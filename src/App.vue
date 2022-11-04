<script setup lang="ts">
  import authModal from '@/components/AuthModal/AuthModal.vue';
  import accountVerificationModal from '@/components/AccountVerificationModal/AccountVerificationModal.vue';
  import appHeader from '@/components/Header/Header.vue';
  import { useCoreModalStore } from '@/stores/useCoreModalStore.ts';
  import { computed } from 'vue';

  const { isAuthModalShown, closeAuthModal, getIsEmailVerifyModalShown, closeEmailVerifyModal } = useCoreModalStore();

</script>

<template>
    <auth-modal :is-open="isAuthModalShown" @close-modal="closeAuthModal" />
    <account-verification-modal :is-open="getIsEmailVerifyModalShown" @close-modal="closeEmailVerifyModal" />
    <app-header />
  
</template>

<style lang="scss" scoped>

</style>
