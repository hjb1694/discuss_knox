import { defineStore } from 'pinia';
import { reactive, computed, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Message } from '@/types';

export const useMessagesStore = defineStore('useMessagesStore', () => {

    const { getAuthToken, getUserData } = useAuthStore();


    const latestMessages = reactive<Message[]>([]);

    const currentChatWithUsername = ref<string>('');


    const getLatestMessages = computed(() => latestMessages);


    const fetchLatestMessages = async () => {

        latestMessages.splice(0,latestMessages.length);

        const response = await axios.get('http://66.42.81.246:8080/api/v1/latest-messages', 
        {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        latestMessages.push(...response.data.body.latest_conversations);

    }

    const markAsRead = (messageId: number) => {

        const message = latestMessages.find(message => message.message_id === messageId);

        if(message?.receiver_user_id === getUserData.user_id){

            message.is_read = true;

        }

    }

    const addIncomingMessage = (data: any) => {

        const existingEntryIdx = latestMessages.findIndex(msg => msg.sender_user_id === data.sender_user_id && msg.receiver_user_id === data.receiver_user_id);

        if(existingEntryIdx > -1){

            latestMessages[existingEntryIdx].message_id = data.message_id;
            latestMessages[existingEntryIdx].sender_user_id = data.sender_user_id;
            latestMessages[existingEntryIdx].receiver_user_id = data.receiver_user_id;
            latestMessages[existingEntryIdx].sender_username = data.sender_username;
            latestMessages[existingEntryIdx].receiver_username = data.receiver_username;
            latestMessages[existingEntryIdx].message_content = data.message_content;

            if(
                !currentChatWithUsername.value || 
                (
                currentChatWithUsername.value && 
                latestMessages[existingEntryIdx].sender_username !== currentChatWithUsername.value && 
                latestMessages[existingEntryIdx].receiver_username !== currentChatWithUsername.value 
                )
            ){
                latestMessages[existingEntryIdx].is_read = false;
            }else{
                latestMessages[existingEntryIdx].is_read = true;
            }

            latestMessages.unshift(latestMessages[existingEntryIdx]);
            latestMessages.splice(existingEntryIdx, 1);

        }else{

            latestMessages.unshift({
                message_id: data.message_id, 
                sender_user_id: data.sender_user_id, 
                receiver_user_id: data.receiver_user_id,
                sender_username: data.sender_username, 
                receiver_username: data.receiver_username,
                message_content: data.message_content,
                added_ts: '', 
                is_read: false
            });

        }

    }

    const clearMessages = () => {
        latestMessages.splice(0, latestMessages.length);
    }

    const clearCurrentChatWithUsername = () => {
        currentChatWithUsername.value = '';
    }

    const setCurrentChatWithUsername = (username: string) => {
        currentChatWithUsername.value = username;
    }



    return {
        getLatestMessages, 
        fetchLatestMessages, 
        markAsRead, 
        clearMessages, 
        addIncomingMessage, 
        clearCurrentChatWithUsername, 
        setCurrentChatWithUsername
    }

})