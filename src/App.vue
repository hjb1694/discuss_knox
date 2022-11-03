<script setup lang="ts">
  import authModal from '@/components/AuthModal/AuthModal.vue';
  import { isAuthModalOpen } from '@/stores/useCoreModalStore.ts';
</script>

<template>
    <auth-modal :is-open="isAuthModalOpen" />
  
</template>

<style lang="scss" scoped>

</style>
