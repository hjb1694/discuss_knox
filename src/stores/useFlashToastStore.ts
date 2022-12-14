import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export enum MessageTypes {
    SUCCESS = 'SUCCESS', 
    ERROR = 'ERROR'
}


export const useFlashToastStore = defineStore('useFlashToastStore', () => {

    const isFlashToastOpen = ref<boolean>(false);
    const messageType = ref<MessageTypes | ''>('');
    const messageText = ref<string | ''>('');


    const getIsFlashToastOpen = computed(() => isFlashToastOpen);
    const getMessageType = computed(() => messageType);
    const getMessageText = computed(() => messageText);


    const openFlashToast = (type: MessageTypes, text: string) => {

        messageType.value = type;
        messageText.value = text;
        isFlashToastOpen.value = true;

    }

    const closeFlashToast = () => {
        messageType.value = '';
        messageText.value = '';
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