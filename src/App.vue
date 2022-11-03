<script setup lang="ts">
  import authModal from '@/components/AuthModal/AuthModal.vue';
  import { useCoreModalStore } from '@/stores/useCoreModalStore.ts';
  import { computed } from 'vue';

  const { isAuthModalShown, closeAuthModal } = useCoreModalStore();

</script>

<template>
    <auth-modal :is-open="isAuthModalShown" @close-modal="closeAuthModal" />
  
</template>

<style lang="scss" scoped>

</style>
