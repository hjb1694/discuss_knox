import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCoreModalStore = defineStore('useCoreModalStore', () => {

    const isAuthModalOpen = ref<boolean>(false);
    const isEmailVerifyModalShown = ref<boolean>(false);
    const isMessagesModalOpen = ref<boolean>(false);

    const isAuthModalShown = computed(() => isAuthModalOpen);
    const getIsEmailVerifyModalShown = computed(() => isEmailVerifyModalShown);
    const getIsMessagesModalOpen = computed(() => isMessagesModalOpen);

    const closeAuthModal = () => {
        isAuthModalOpen.value = false;
    }

    const openAuthModal = () => {
        isAuthModalOpen.value = true;
    }

    const openEmailVerifyModal = () => {
        isEmailVerifyModalShown.value = true;
    }

    const closeEmailVerifyModal = () => {
        isEmailVerifyModalShown.value = false;
    }

    const openMessagesModal = () => {
        isMessagesModalOpen.value = true;
    }

    const closeMessagesModal = () => {
        isMessagesModalOpen.value = false;
    }


    return {
        isAuthModalShown, 
        getIsEmailVerifyModalShown,
        getIsMessagesModalOpen,
        closeAuthModal, 
        openAuthModal, 
        openEmailVerifyModal, 
        closeEmailVerifyModal, 
        openMessagesModal, 
        closeMessagesModal
    }


});