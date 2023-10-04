import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import Pusher from 'pusher-js';


interface PusherInstance {
    instance: Pusher | null, 
    channel: any
}

export const usePusherStore = defineStore('usePusherStore', () => {

    const pusherInstance = reactive<PusherInstance>({
        instance: null, 
        channel: null
    });

    const getPusherInstance = computed(() => pusherInstance);

    const createPusherInstance = (userToken: string, userId: number) => {
        pusherInstance.instance = new Pusher('f5ea34c17095fbb4548a', {
            channelAuthorization: {
                endpoint: `http://206.189.193.136:3001/api/v1/pusher/auth`, 
                transport: 'ajax',
                headers: {
                    'x-auth-token': userToken
                }, 
                params: {
                    channel: `private-user-${userId}`
                }
            }
        });

        subscribeToPrivateChannel(userId);

    }


    const subscribeToPrivateChannel = (userId: number) => {
        pusherInstance.channel = pusherInstance.instance?.subscribe(`private-user-${userId}`);
    }

    const clearPusherInstance = () => {
        pusherInstance.instance = null;
        pusherInstance.channel = null;
    }

    return {
        getPusherInstance, 
        createPusherInstance, 
        clearPusherInstance
    }

});
