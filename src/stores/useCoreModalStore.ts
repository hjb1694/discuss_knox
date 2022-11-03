import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCoreModalStore = defineStore('useCoreModalStore', () => {

    const isAuthModalOpen = ref<boolean>(false);

    return {
        isAuthModalOpen
    }


});