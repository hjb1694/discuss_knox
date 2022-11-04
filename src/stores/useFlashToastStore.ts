import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

enum MessageTypes {
    SUCCESS = 'SUCCESS', 
    ERROR = 'ERROR'
}


export const useFlashToastStore = defineStore('useFlashToastStore', () => {

    const isFlashToastOpen = ref<boolean>(false);
    const messageType = ref<MessageTypes | null>(null);
    const messageText = ref<string | null>(null);


    const getIsFlashToastOpen = computed(() => isFlashToastOpen);
    const getMessageType = computed(() => messageType);
    const getMessageText = computed(() => messageText);


    const openFlashToast = (type: MessageTypes, text: string) => {

        messageType.value = type;
        messageText.value = text;
        isFlashToastOpen.value = true;

    }

    const closeFlashToast = () => {
        messageType.value = null;
        messageText.value = null;
        isFlashToastOpen.value = false;
    }

    return {
        getIsFlashToastOpen, 
        getMessageType, 
        getMessageText, 
        openFlashToast, 
        closeFlashToast
    }


});