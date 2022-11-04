import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCoreModalStore = defineStore('useCoreModalStore', () => {

    const isAuthModalOpen = ref<boolean>(false);

    const isAuthModalShown = computed(() => isAuthModalOpen);

    const closeAuthModal = () => {
        isAuthModalOpen.value = false;
    }

    const openAuthModal = () => {
        isAuthModalOpen.value = true;
    }


    return {
        isAuthModalShown, 
        closeAuthModal, 
        openAuthModal
    }


});