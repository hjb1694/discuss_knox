<template>
    <div class="follows-side-drawer">
        <div class="follows-side-drawer__backdrop" @click="closeFollowDrawer"></div>
        <div class="follows-side-drawer__drawer">
            <div class="follows-side-drawer__requests section">
                <h2>Pending Follower Requests</h2>
                <template v-if="getFirstFivePendingRequests.length">
                    <div v-for="request in getFirstFivePendingRequests" class="item">
                        <div><i class="fa fa-user"></i> {{ request.username }}</div>
                        <div class="response-buttons">
                            <button class="accept-btn" @click="acceptDenyRequest('accept', request.follower_user_id)">
                                <i class="fa fa-check"></i> Accept
                            </button>
                            <button class="deny-btn" @click="acceptDenyRequest('deny', request.follower_user_id)">
                                <i class="fa fa-close"></i> Deny
                            </button>
                        </div>
                    </div>
                </template>
                <div class="no-exist" v-else>
                    You have no pending followers.
                </div>
                <button class="more-btn">See All</button>
            </div>
            <div class="follows-side-drawer__followers section">
                <h2>Your Followers ({{ followerCount }})</h2>
                <template v-if="getFirstFiveFollowers.length">
                    <div v-for="follower in getFirstFiveFollowers" class="item">
                        <div @click="goTo('/user/profile/' + follower.follower_username)"><i class="fa fa-user"></i> {{ follower.follower_username }}</div>
                    </div>
                </template>
                <div class="no-exist" v-else>
                    You have no followers.
                </div>
                <button class="more-btn">See All</button>
            </div>
            <div class="follows-side-drawer__following section">
                <h2>Who You Follow</h2>
                <button class="more-btn">See All</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useFollowsStore } from '@/stores/useFollowsStore';

    const { push: routerPush } = useRouter();
    const { 
        fetchPendingFollowRequests, 
        fetchFollowers, 
        getPendingRequests, 
        getFollowers, 
        closeFollowDrawer, 
        acceptDenyRequest 
    } = useFollowsStore();

    const getFirstFivePendingRequests = computed(() => getPendingRequests.slice(0,5));
    const getFirstFiveFollowers = computed(() => getFollowers.slice(0,5));
    const followerCount = computed(() => getFollowers.length);

    const goTo = (path) => {
        closeFollowDrawer();
        routerPush(path);
    }

    onMounted(() => {
        fetchPendingFollowRequests();
        fetchFollowers();
    });



</script>

<style lang="scss" scoped>
    .section{
        padding:2rem 1rem;
    }

    h2{
        padding:.5rem 0;
        white-space:nowrap;
    }

    .follows-side-drawer{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:999;

        &__backdrop{
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            z-index:1000;
            background:rgba(0,0,0,.7);
        }

        &__drawer{
            position:fixed;
            top:0;
            left:0;
            width:0;
            height:100%;
            z-index:1001;
            background:#fff;
            overflow-x:hidden;
            overflow-y:auto;
            animation: slide-out .5s forwards;
        }
    }

    .more-btn{
        border:none;
        background:transparent;
        padding:.5rem 0;
        white-space:nowrap;
    }

    .no-exist{
        color:#bbb;
        font-size:1.4rem;
        margin:1rem 0;
        white-space:nowrap;
    }

    .item{
        font-size:1.4rem;
        padding:1rem 0;
        border:1px solid #ccc;
        border-radius:.5rem;
        margin-bottom:3px;
        padding:1rem;
        white-space:nowrap;
        background:#f1f1f1;
    }

    .accept-btn, 
    .deny-btn{
        background:transparent;
        border:none;
        display:inline-block;
    }

    .accept-btn{
        margin-right:2rem;
        color:green;
    }

    .deny-btn{
        color:#f00;
    }

    .response-buttons{
        margin-top:1rem;
    }

    @keyframes slide-out {
        from{width:0;}
        to{width:30rem;}
    }
</style>