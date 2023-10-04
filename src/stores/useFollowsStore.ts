import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';
import { usePusherStore } from './usePusherStore';
import type { FollowRequest } from '@/types';

export const useFollowsStore = defineStore('useFollowsStore', () => {

    const { getAuthToken } = useAuthStore();
    const { getPusherInstance } = usePusherStore();

    const followDrawerIsOpen = ref<boolean>(false);
    const followings = reactive<object[]>([]);
    const followers = reactive<object[]>([]);
    const pendingRequests = reactive<FollowRequest[]>([]);

    const getFollowings = computed(() => followings);
    const getFollowers = computed(() => followers);
    const getPendingRequests = computed(() => pendingRequests);
    const getFollowDrawerIsOpen = computed(() => followDrawerIsOpen);

    const getUnseenFollowRequestsCount = () => {

        return pendingRequests.filter(req => !req.seen).length;

    }

    const fetchPendingFollowRequests = async () => {

        const response = await axios.get('http://206.189.193.136:3001/api/v1/pending-follow-requests', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        pendingRequests.splice(0,pendingRequests.length);
        pendingRequests.push(...response.data.body);

    }

    const fetchFollowers = async () => {

        const response = await axios.get('http://206.189.193.136:3001/api/v1/followers', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        followers.splice(0,followers.length);
        followers.push(...response.data.body);


    }

    const fetchFollowings = async () => {

        const response = await axios.get('http://206.189.193.136:3001/api/v1/followings', {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        followings.splice(0,followings.length);
        followings.push(...response.data.body);

    }

    const acceptDenyRequest = async (action: 'accept' | 'deny', followerUserId: number) => {

        await axios.patch('http://206.189.193.136:3001/api/v1/followers', {
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

    const markAllPendingFollowersAsSeen = async () => {

        for(let req of pendingRequests){
            req.seen = true;
        }

        await axios.patch('http://206.189.193.136:3001/api/v1/update-follows-seen', {}, {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

    }

    const listenForNewFollowRequests = () => {

        getPusherInstance.channel.bind('new-follow-request', (data: any) => {
            if(followDrawerIsOpen.value === true){
                data.seen = true;
            }
            pendingRequests.unshift(data);
        })

    }

    const openFollowDrawer = () => {
        followDrawerIsOpen.value = true;
        markAllPendingFollowersAsSeen();
    }

    const closeFollowDrawer = () => {
        followDrawerIsOpen.value = false;
    }

    const clearAll = () => {
        followings.splice(0,followings.length);
        followers.splice(0,followers.length);
        pendingRequests.splice(0,pendingRequests.length);
    }

    const initFollows = () => {
        fetchPendingFollowRequests();
        fetchFollowers();
        fetchFollowings();
        listenForNewFollowRequests();
    }

    return {
        getFollowings, 
        getFollowers, 
        getPendingRequests,
        getFollowDrawerIsOpen, 
        getUnseenFollowRequestsCount,
        acceptDenyRequest,
        openFollowDrawer,
        closeFollowDrawer,
        clearAll, 
        initFollows
    }

});
