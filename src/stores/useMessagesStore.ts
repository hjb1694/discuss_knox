import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

export const useMessagesStore = defineStore('useMessagesStore', () => {

    const { getAuthToken } = useAuthStore();


    const latestMessages = reactive<object[]>([]);


    const getLatestMessages = computed(() => latestMessages);


    const fetchLatestMessages = async () => {

        const response = await axios.get('http://66.42.81.246:8080/api/v1/latest-messages', 
        {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        latestMessages.push(...response.data.body.latest_conversations);

    }



    return {
        getLatestMessages, 
        fetchLatestMessages
    }

})