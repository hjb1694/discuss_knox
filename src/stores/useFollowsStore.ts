import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

export const useFollowsStore = defineStore('useFollowsStore', () => {

    const { getAuthToken } = useAuthStore();

    const followDrawerIsOpen = ref<boolean>(false);
    const followings = reactive([]);
    const followers = reactive([]);
    const pendingRequests = reactive<object[]>([]);

    const getFollowings = computed(() => followings);
    const getFollowers = computed(() => followers);
    const getPendingRequests = computed(() => pendingRequests);
    const getFollowDrawerIsOpen = computed(() => followDrawerIsOpen);

    const fetchPendingFollowRequests = async () => {

        return axios.get('http://localhost:3001/api/v1/pending-follow-requests', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        }).then(response => {
            pendingRequests.splice(0,pendingRequests.length);
            pendingRequests.push(...response.data.body);
        });


    }

    const openFollowDrawer = () => {
        followDrawerIsOpen.value = true;
    }

    const closeFollowDrawer = () => {
        followDrawerIsOpen.value = false;
    }

    return {
        getFollowings, 
        getFollowers, 
        getPendingRequests,
        getFollowDrawerIsOpen, 
        openFollowDrawer,
        closeFollowDrawer,
        fetchPendingFollowRequests
    }

});