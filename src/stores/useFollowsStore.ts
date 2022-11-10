import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

export const useFollowsStore = defineStore('useFollowsStore', () => {

    const { getAuthToken } = useAuthStore();

    const followDrawerIsOpen = ref<boolean>(false);
    const followings = reactive<object[]>([]);
    const followers = reactive<object[]>([]);
    const pendingRequests = reactive<object[]>([]);

    const getFollowings = computed(() => followings);
    const getFollowers = computed(() => followers);
    const getPendingRequests = computed(() => pendingRequests);
    const getFollowDrawerIsOpen = computed(() => followDrawerIsOpen);

    const fetchPendingFollowRequests = async () => {

        const response = await axios.get('http://66.42.81.246:8080/api/v1/pending-follow-requests', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        pendingRequests.splice(0,pendingRequests.length);
        pendingRequests.push(...response.data.body);

    }

    const fetchFollowers = async () => {

        const response = await axios.get('http://66.42.81.246:8080/api/v1/followers', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        followers.splice(0,followers.length);
        followers.push(...response.data.body);


    }

    const fetchFollowings = async () => {

        const response = await axios.get('http://66.42.81.246:8080/api/v1/followings', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        followings.splice(0,followings.length);
        followings.push(...response.data.body);

    }

    const acceptDenyRequest = async (action: 'accept' | 'deny', followerUserId: number) => {

        await axios.patch('http://66.42.81.246:8080/api/v1/followers', {
            action, 
            follower_user_id: followerUserId
        }, 
        {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        fetchPendingFollowRequests();
        fetchFollowers();

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
        acceptDenyRequest,
        openFollowDrawer,
        closeFollowDrawer,
        fetchPendingFollowRequests, 
        fetchFollowers,
        fetchFollowings,
        clearAll
    }

});