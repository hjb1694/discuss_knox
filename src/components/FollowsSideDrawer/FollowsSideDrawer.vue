<template>
    <div class="follows-side-drawer">
        <div class="follows-side-drawer__backdrop" @click="closeFollowDrawer"></div>
        <div class="follows-side-drawer__drawer">
            <div class="follows-side-drawer__requests section">
                <h2>Pending Follower Requests</h2>
                <template v-if="getFirstFivePendingRequests.length">
                    <div v-for="request in getFirstFivePendingRequests" class="item">
                        <div>{{ request.username }}</div>
                        <div>
                            <button class="accept-btn">
                                <i class="fa fa-check"></i> Accept
                            </button>
                            <button class="deny-btn">
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
                <h2>Your Followers</h2>
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
    import { useFollowsStore } from '@/stores/useFollowsStore';

    const { fetchPendingFollowRequests, getPendingRequests, closeFollowDrawer } = useFollowsStore();

    const getFirstFivePendingRequests = computed(() => getPendingRequests.slice(0,5));

    onMounted(() => {
        fetchPendingFollowRequests().then(resp => {
            
        });
    });



</script>

<style lang="scss" scoped>
    .section{
        padding:2rem 1rem;
    }

    h2{
        padding:.5rem 0;
    }

    .follows-side-drawer{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:999;
        overflow-x:hidden;
        overflow-y:auto;

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
            width:30rem;
            height:100%;
            z-index:1001;
            background:#fff;
        }
    }

    .more-btn{
        border:none;
        background:transparent;
        padding:.5rem 0;
    }

    .no-exist{
        color:#bbb;
        font-size:1.4rem;
        margin:1rem 0;
    }

    .item{
        font-size:1.4rem;
        padding:1rem 0;
        border:1px solid #ccc;
        border-radius:.5rem;
        margin-bottom:3px;
        padding:1rem;
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
</style>