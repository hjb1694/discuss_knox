<template>
    <div>
        <div class="top-banner">
            <p>A Ktown Portal Official Website</p>
        </div>
        <header class="primary-header">
            <div class="container">
                <img @click="routerPush('/')" class="primary-header__logo" src="@/assets/knox_discuss_logo.png"/>
                <button v-if="!getIsLoggedIn" class="auth-btn" @click="openAuthModal">
                    <div class="auth-btn__icon-container">
                        <i class="auth-btn__icon fa fa-user"></i>
                    </div>
                </button>
                <div v-else class="user-dropdown">
                    <button class="user-dropdown__toggle" @click="isUserPaneShown = !isUserPaneShown">
                        <span>{{ getUserData.username!.substring(0,1) }}</span>
                        <div v-if="totalBadgeCount" class="badge user-dropdown__badge">
                        {{ totalBadgeCount }}
                        </div>
                    </button>
                    <div class="user-dropdown__pane" v-show="isUserPaneShown">
                        <div class="user-dropdown__item">
                            <i class="fa fa-user"></i>
                            <p>{{ getUserData.username }}</p>
                        </div>
                        <div class="user-dropdown__item" @click="goToProfile">
                            Profile
                        </div>
                        <div class="user-dropdown__item">
                            Notifications
                        </div>
                        <div class="user-dropdown__item space-between" @click="goToMessages">
                            <span>Messages</span>
                            <span v-if="newMessageCount" class="badge">
                                {{ newMessageCount }}
                            </span>
                        </div>
                        <div class="user-dropdown__item space-between" @click="handleFollowsButtonClick">
                            <span>Follows</span>
                            <span v-if="newFollowRequestCount" class="badge">
                                {{ newFollowRequestCount }}
                            </span>
                        </div>
                        <div class="user-dropdown__item" @click="goToAccountSettings">
                            Settings
                        </div>
                        <div class="user-dropdown__item" @click="userLogout">
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div class="secondary-header">
            <div class="container">
                <button @click="goToNewThreadPage">
                    <i class="menu-icon fa fa-plus"></i>
                    <span>New Thread</span>
                </button>
                <button @click="goToFeed">
                    <i class="menu-icon fa fa-refresh"></i>
                    <span>Feed</span>
                </button>
                <div class="dropdown">
                    <button @click="toggleChannelDropdown">
                        <i class="menu-icon fa fa-list"></i>
                        <span>Channels</span>
                    </button>
                    <div v-if="isChannelDropdownShown" class="dropdown__area dropdown__area--channels">
                        <app-multi-select 
                        v-model="channelSelection" 
                        :options="channelSelectOpts" 
                        @select="channelSelect($event)" 
                        placeholder="Search or Select Channel" 
                        :style="{fontSize: '1.2rem'}"
                        :show-labels="false"
                        />
                        <div class="recommended-channels">
                            <h3>Recommended Channels</h3>
                            <ul v-if="recommendedChannels.length">
                                <li v-for="channel in recommendedChannels" :key="channel.id" @click="gotoChannel(channel.channel_slug!)" class="rec-channel">
                                    c/{{ channel.channel_slug }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import { useFollowsStore } from '@/stores/useFollowsStore';
    import { useMessagesStore } from '@/stores/useMessagesStore';
    import { ref, reactive, onMounted, watch, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import AppMultiSelect from 'vue-multiselect';
    import axios from 'axios';
    import type { Channel } from '@/types';

    const { openAuthModal, openEmailVerifyModal } = useCoreModalStore();
    const { getIsLoggedIn, getUserData, logout } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();
    const { openFollowDrawer, getPendingRequests, getUnseenFollowRequestsCount } = useFollowsStore();
    const { push: routerPush } = useRouter();
    const { fetchNewMessageCount, getLatestMessages } = useMessagesStore();

    const isUserPaneShown = ref<boolean>(false);

    const isChannelDropdownShown = ref<boolean>(false);
    const channelSelection = ref<string>('');
    const channelSelectOpts = reactive<string[]>([]);
    const newMessageCount = ref<number>(0);
    const newFollowRequestCount = ref<number>(0);

    const recommendedChannels = reactive<Channel[]>([]);

    const totalBadgeCount = computed(() => {
        return newMessageCount.value + newFollowRequestCount.value;
    });

    const userLogout = () => {
        logout();
        isUserPaneShown.value = false;
        openFlashToast(MessageTypes.SUCCESS, 'Logout Successful!');
    }

    const handleFollowsButtonClick = () => {
        isUserPaneShown.value = false;
        openFollowDrawer();
    }

    const goToProfile = () => {
        isUserPaneShown.value = false;
        routerPush({
            name: 'profile', 
            params: {
                username: getUserData.username
            }
        });
    }

    const goToAccountSettings = () => {
        isUserPaneShown.value = false;
        isChannelDropdownShown.value = false;
        routerPush({
            name: 'account-settings'
        });
    }

    const goToNewThreadPage = () => {
        isChannelDropdownShown.value = false;
        isUserPaneShown.value = false;
        if(getIsLoggedIn.value === false){
            openAuthModal();
        }else if(getUserData.account_status === 'NOT_VERIFIED'){
            openEmailVerifyModal();
        }else{
            routerPush('/thread/new');
        }
    }

    const goToFeed = () => {
        isChannelDropdownShown.value = false;
        isUserPaneShown.value = false;
        routerPush('/');
    }

    const goToMessages = () => {
        isChannelDropdownShown.value = false;
        isUserPaneShown.value = false;
        routerPush('/user/messages');
    }

    const toggleChannelDropdown = () => {
        isChannelDropdownShown.value = !isChannelDropdownShown.value;
    }

    const fetchChannels = async () => {

        try{

            const response = await axios.get('https://www.ktpdiscussapi.com/api/v1/channels');

            const opts = response.data.body.channels.map((channel: any) => `c/${channel.channel_slug}`);
            const rec = response.data.body.channels.filter((channel: any) => channel.is_featured === true);

            channelSelectOpts.push(...opts);

            recommendedChannels.push(...rec);

        }catch(e){
            console.error(e);
        }


    }

    const gotoChannel = (channel: string) => {
        routerPush(`/channel/${channel}`);
        isChannelDropdownShown.value = false;
    }

    const channelSelect = (selectedOption: string) => {

        routerPush(`/channel/${selectedOption.substring(2)}`);

        channelSelection.value = '';
        isChannelDropdownShown.value = false;

    }

    watch(getLatestMessages, () => {
        newMessageCount.value = fetchNewMessageCount();
    });

    watch(getPendingRequests, () => {
        newFollowRequestCount.value = getUnseenFollowRequestsCount();
    });

    onMounted(() => {
        fetchChannels();
    });




</script>

<style lang="scss" scoped>
    .top-banner{
        background:#333;
        height:3rem;
        display:flex;
        justify-content:center;
        align-items:center;
        color:#fff;
        font-size:1.4rem;
    }

    .container{
        max-width:75%;
        margin:0 auto;
    }

    .primary-header {
        border-bottom:1px solid #eee;
        background:#fff;
        padding:1.5rem;
        height:8rem;

        &__logo{
            display:block;
            width:25rem;
            cursor:pointer;
        }
    }

    .secondary-header{
        padding:0 1rem;
    }

    .primary-header .container{
        display:flex;
        align-items: center;
        justify-content: space-between;
    }

    .secondary-header .container{
        height:100%;
        display:flex;
        align-items:center;
    }

    .auth-btn{

        display:flex;
        align-items:center;
        background:transparent;
        border:none;
        position:relative;

        &__icon-container{
            width:4rem;
            height:4rem;
            border-radius:90%;
            box-shadow:0 0 .5rem rgba(0,0,0,.24);
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:1rem;
            background:#21bf8f;
            color:#fff;
        }

    }

    .secondary-header{
        background:linear-gradient(to bottom, #21bf8f 50%, #33ab87 50%);
        height:4rem;

        button{
            background:transparent;
            border:none;
            color:#fff;
            font-weight:bold;
            font-size:1.6rem;

            &:not(:last-child){
                margin-right:2rem;
            }
        }
    }

    .user-dropdown{

        position:relative;
        z-index:1;

        &__toggle{
            width:4rem;
            height:4rem;
            border-radius:90%;
            display:flex;
            justify-content:center;
            align-items:center;
            border:1px solid #ccc;
        }

        &__badge{
            position:absolute;
            top:-.5rem;
            right:-1rem;
        }

        &__pane{
            position:absolute;
            top:5rem;
            right:0;
            background:#fff;
            box-shadow:0 0 .5rem rgba(0,0,0,.24);
            min-width:15rem;
        }

        &__item{
            display:flex;
            align-items:center;
            font-size:1.4rem;
            padding:1rem;
            transition:background .3s;
            cursor:pointer;

            i{
                margin-right:1rem;
            }

            &:hover{
                background:#fafafa;
            }

            &.space-between{
                justify-content: space-between;
            }
        }


    }

    .dropdown{
        position:relative;

        &__area{
            position:absolute;
            z-index:999;
            padding:1rem;
            background:#fff;
            top:3.2rem;
            box-shadow:0 0 .5rem rgba(0,0,0,.24);

            &--channels{
                left:-75%;
                width:47rem;
            }
        }
    }

    .recommended-channels{
        margin-top:2rem;

        h3{
            font-size:1.4rem;
        }

        ul{
            list-style:none;
            margin-top:1rem;

            li{
                font-size:1.4rem;
                margin-top:.5rem;
            }
        }
    }

    .menu-icon{
        margin-right:.5rem;
    }

    .badge{
        font-size:1.2rem;
        background:#f00;
        color:#fff;
        border-radius:.5rem;
        display:flex;
        align-items: center;
        justify-content: center;
        width:3rem;
    }

    .rec-channel{
        cursor: pointer;
        color:#11998e;
    }


    @media (max-width:700px) {

        .container{
            max-width:100%;
        }

        .primary-header__logo{
            width:20rem;
        }

        .secondary-header{
            button{
                font-size:1.4rem;
            }
        }

        .dropdown{

            &__area{
                
                &--channels{
                    left:-20rem;
                    width:32rem;
                }

            }

        }


    }
</style>