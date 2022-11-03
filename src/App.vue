<script setup lang="ts">
  import authModal from '@/components/AuthModal/AuthModal.vue';
  import { useCoreModalStore } from '@/stores/useCoreModalStore.ts';

  const { isAuthModalOpen } = useCoreModalStore();
</script>

<template>
    <auth-modal :is-open="isAuthModalOpen" />
  
</template>

<style lang="scss" scoped>

</style>
