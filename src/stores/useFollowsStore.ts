import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

export const useFollowsStore = defineStore('useFollowsStore', () => {

    const { getAuthToken } = useAuthStore();

    const followDrawerIsOpen = ref<boolean>(false);
    const followings = reactive([]);
    const followers = reactive<object[]>([]);
    const pendingRequests = reactive<object[]>([]);

    const getFollowings = computed(() => followings);
    const getFollowers = computed(() => followers);
    const getPendingRequests = computed(() => pendingRequests);
    const getFollowDrawerIsOpen = computed(() => followDrawerIsOpen);

    const fetchPendingFollowRequests = async () => {

        const response = await axios.get('http://localhost:3001/api/v1/pending-follow-requests', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        pendingRequests.splice(0,pendingRequests.length);
        pendingRequests.push(...response.data.body);

    }

    const fetchFollowers = async () => {

        const response = await axios.get('http://localhost:3001/api/v1/followers', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        console.log(response);

        followers.splice(0,followers.length);
        followers.push(...response.data.body);


    }

    const openFollowDrawer = () => {
        followDrawerIsOpen.value = true;
    }

    const closeFollowDrawer = () => {
        followDrawerIsOpen.value = false;
    }

    const clearAll = () => {
        followings.splice(0,followings.length);
        followers.splice(0,followers.length);
        pendingRequests.splice(0,pendingRequests.length);
    }

    return {
        getFollowings, 
        getFollowers, 
        getPendingRequests,
        getFollowDrawerIsOpen, 
        openFollowDrawer,
        closeFollowDrawer,
        fetchPendingFollowRequests, 
        fetchFollowers,
        clearAll
    }

});