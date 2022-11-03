import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCoreModalStore = defineStore('useCoreModalStore', () => {

    const isAuthModalOpen = ref<boolean>(true);

    const isAuthModalShown = computed(() => isAuthModalOpen);

    const closeAuthModal = () => {
        isAuthModalOpen.value = false;
        console.log(isAuthModalOpen.value);
    }


    return {
        isAuthModalShown, 
        closeAuthModal
    }


});