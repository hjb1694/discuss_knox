<template>
    <div class="profile">
        <private-message-modal 
        v-if="profileData.userId"
        :chat-with-username="username" 
        :chat-with-user-id="profileData.userId"
        :is-open="getIsMessagesModalOpen"
        @close-modal="closeMessagesModal"
        />
        <div class="container">
            <template v-if="isProfileLoading">
                <div class="loading-spinner-container">
                    <img class="loading-spinner" src="@/assets/ring-spinner.svg" alt="Loading..."/>
                </div>
            </template>
            <template v-else-if="isErrorLoadingProfile">
                <div class="error-loading-profile">
                    <div class="error-loading-profile__content">
                        <i class="fa fa-times"></i>
                        <p class="error-loading-profile__super-text">Aww Snap!</p>
                        <p class="error-loading-profile__text">Unable to Load Profile</p>
                    </div>
                </div>
            </template>
            <template v-else-if="isProfileNotFound">
                <div class="not-found">
                    <div class="not-found__content">
                        <i class="fa fa-times"></i>
                        <p class="not-found__super-text">Aww Snap!</p>
                        <p class="not-found__text">Profile Not Found</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="profile-banner">
                    <img class="profile-banner__img" src="@/assets/no_user.png" />
                    <h1 class="profile-banner__username">{{ username }}</h1>
                    <template v-if="isElevatedCoreStatus">
                        <div v-if="profileData.coreRole === 'SUPER_ADMINISTRATOR'" class="profile-banner__role-badge">Super Admin</div>
                        <div v-if="profileData.coreRole === 'ADMINISTRATOR'" class="profile-banner__role-badge">Admin</div>
                        <div v-if="profileData.coreRole === 'STAFF'" class="profile-banner__role-badge">Staff</div>
                    </template>
                </div>
                <div class="profile-grid">
                    <div v-if="!isUserDeactivated" class="control-pane">
                        <template v-if="isPersonalBtnsShown">
                            <button class="control-pane__btn">
                                <i class="fa fa-edit"></i>
                                <span>Edit Profile</span>
                            </button>
                            <button class="control-pane__btn">
                                <i class="fa fa-cogs"></i>
                                <span>Account Settings</span>
                            </button>
                        </template>
                        <template v-else>
                            <template v-if="!profileData.isBlocker && !profileData.isBlocked">
                                <button v-if="!profileData.followStatus" class="control-pane__btn" @click="follow" :disabled="isControlButtonsDisabled">
                                    <span>Follow User</span>
                                </button>
                                <button v-if="profileData.followStatus === 'PENDING'" class="control-pane__btn" @click="unfollow" :disabled="isControlButtonsDisabled">
                                    <span>Cancel Follow Request</span>
                                </button>
                                <button v-if="profileData.followStatus === 'ACCEPTED'" class="control-pane__btn" @click="unfollow" :disabled="isControlButtonsDisabled">
                                    <span>Unfollow User</span>
                                </button>
                                <button class="control-pane__btn" @click="handleSendMessageBtnClick">
                                    <span>Send Message</span>
                                </button>
                            </template>
                            <template v-if="!isElevatedCoreStatus">
                                <button v-if="!profileData.isBlocker" class="control-pane__btn" @click="block" :disabled="isControlButtonsDisabled">
                                    <span v-if="!isControlProcessing.block">Block User</span>
                                    <span v-else>
                                        <img class="control-spinner" src="@/assets/ring-spinner.svg" alt="Processing..." />
                                    </span>
                                </button>
                                <button v-if="profileData.isBlocker" class="control-pane__btn" @click="unblock" :disabled="isControlButtonsDisabled">
                                    <span v-if="!isControlProcessing.unblock">Unblock</span>
                                    <span v-else>
                                        <img class="control-spinner" src="@/assets/ring-spinner.svg" alt="Processing..." />
                                    </span>
                                </button>
                                <button class="control-pane__btn">
                                    <span>Report User</span>
                                </button>
                            </template>
                        </template>
                    </div>
                    <div v-else></div>
                    <div class="main-area">
                        <div v-if="!isUserDeactivated" class="white-card">
                            <strong class="white-card__key">Gender:</strong> 
                            <span v-if="profileData.gender === 'not specified'" class="empty"><em>[Not Specified]</em></span>
                            <span v-else>{{ gender }}</span>
                        </div>
                        <template v-if="getIsLoggedIn && !profileData.isPrivate && !isUserDeactivated">
                            <div class="white-card">
                                <strong class="white-card__key">Occupation:</strong>
                                <span v-if="!profileData.occupation" class="empty"><em>[Not Specified]</em></span>
                                <span>{{ profileData.occupation }}</span>
                            </div>
                            <div class="white-card">
                                <strong class="white-card__key">Location:</strong>
                                <span v-if="!profileData.location" class="empty"><em>[Not Specified]</em></span>
                                <span>{{ profileData.location }}</span>
                            </div>
                            <div class="white-card bio-card">
                                <div><strong class="white-card__key">Bio:</strong></div>
                                <div v-if="!profileData.bio" class="empty"><em>[So empty...]</em></div>
                                <div v-html="profileData.bio"></div>
                            </div>


                        </template>
                        <div class="white-card" v-if="profileData.isPrivate && !isUserDeactivated">
                            Private Profile
                        </div>
                        <div class="white-card" v-if="isUserDeactivated">
                            User Deactivated
                        </div>
                        <div class="white-card" v-if="!profileData.isPrivate && !getIsLoggedIn && !isUserDeactivated">
                            Login to see more of {{ username }}'s profile.
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>


<script lang="ts" setup>
    import { computed, ref, reactive, onMounted, watch } from 'vue';
    import { useRoute, onBeforeRouteUpdate } from 'vue-router';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import axios from 'axios';
    import privateMessageModal from '@/components/PrivateMessageModal/PrivateMessageModal.vue';

    const { params: routeParams, beforeRouteUpdate } = useRoute();
    const { getUserData, getIsLoggedIn, getAuthToken, logout } = useAuthStore();
    const { openAuthModal, openEmailVerifyModal, getIsMessagesModalOpen, closeMessagesModal, openMessagesModal } = useCoreModalStore();
    const { openFlashToast } = useFlashToastStore();

    const isProfileLoading = ref<boolean>(true);
    const isProfileNotFound = ref<boolean>(false);
    const isErrorLoadingProfile = ref<boolean>(false);

    const username = ref<string>(routeParams.username);

    console.log('USERNAME VAL', routeParams.username);

    const profileData = reactive({
        isPrivate: null, 
        accountStatus: null, 
        coreRole: null, 
        moderatorRole: null, 
        gender: null, 
        isBlocked: null, 
        isBlocker: null,
        bio: null, 
        location: null, 
        occupation: null, 
        profileImage: null, 
        userId: null, 
        followStatus: null
    });

    const isControlProcessing = reactive({
        block: false, 
        unblock: false,
        follow: false, 
        unfollow: false
    });

    const isControlButtonsDisabled = computed(() => {
        return isControlProcessing.block || isControlProcessing.unblock || isControlProcessing.follow || isControlProcessing.unfollow;
    });

    const isPersonalBtnsShown = computed(() => {
        return getIsLoggedIn.value && username.value === getUserData.username;
    });

    const isUserDeactivated = computed(() => {
        return ['VIOLATION_DEACTIVATION', 'USER_SELF_DEACTIVATION'].includes(profileData.accountStatus);
    });

    const isElevatedCoreStatus = computed(() => {
        return ['SUPER_ADMINISTRATOR', 'ADMINISTRATOR', 'STAFF'].includes(profileData.coreRole);
    });

    const resetProfileData = () => {
        for(let key in profileData){
            profileData[key] = null;
        }
    }

    const fetchPublicFacingProfile = async () => {
        isProfileLoading.value = true;
        isProfileNotFound.value = false;
        isErrorLoadingProfile.value = false;
        resetProfileData();

        try{

            const response = await axios.get(`http://localhost:3001/api/v1/profile/public/${username.value}`);

            console.log(response);

            const { account_status, core_role, moderator_role, is_profile_private, gender, user_id} = response.data.body;

            profileData.isPrivate = is_profile_private;
            profileData.accountStatus = account_status;
            profileData.coreRole = core_role;
            profileData.moderatorRole = moderator_role;
            profileData.gender = gender;
            profileData.userId = user_id;

        }catch(e){
            if(e.response.data?.short_msg){
                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_NOT_FOUND'){
                    isProfileNotFound.value = true;
                }

            }else{
                isErrorLoadingProfile.value = true;
            }

        }finally{
            isProfileLoading.value = false;
        }

    }

    const fetchMemberFacingProfile = async () => {
        isProfileLoading.value = true;
        isProfileNotFound.value = false;
        isErrorLoadingProfile.value = false;
        resetProfileData();

        try{

            const response = await axios.get(`http://localhost:3001/api/v1/profile/member/${username.value}`, {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            const {
                account_status, 
                core_role, 
                moderator_role,
                is_profile_private, 
                profile_image, 
                bio, 
                location, 
                gender, 
                occupation, 
                is_blocked, 
                is_blocker,
                user_id, 
                follow_status
            } = response.data.body;

            profileData.accountStatus = account_status;
            profileData.isPrivate = is_profile_private;
            profileData.coreRole = core_role;
            profileData.moderatorRole = moderator_role;
            profileData.profileImage = profile_image;
            profileData.bio = bio;
            profileData.location = location;
            profileData.occupation = occupation;
            profileData.gender = gender;
            profileData.isBlocked = is_blocked;
            profileData.userId = user_id;
            profileData.isBlocker = is_blocker;
            profileData.followStatus = follow_status;

        }catch(e){

            console.error(e);

            if(e.data?.short_msg){
                const shortMsg = e.data.short_msg;

                if(shortMsg === 'ERR_USER_DEACTIVATED'){
                    openFlashToast(MessageTypes.ERROR, 'Your account has been deactivated.');
                    logout();
                }

            }else{
                isErrorLoadingProfile.value = true;
            }


        }finally{
            isProfileLoading.value = false;
        }

    }

    const checkAuthStatus = () => {
        if(!getIsLoggedIn.value){
            openAuthModal();
            return false;
        }else if(!getUserData.account_status === 'NOT_VERIFIED'){
            openEmailVerifyModal();
            return false;
        }

        return true;
    }

    const handleBlockUnblockResponseErrors = (e) => {

        console.log(e);

        if(e.response?.data?.short_msg){

            const shortMsg = e.response.data.short_msg;

            if(shortMsg === 'ERR_DEACTIVATION'){
                openFlashToast(MessageTypes.ERROR, 'Your account has been deactivated.');
                logout();
            }else if(shortMsg === 'NOT_VERIFIED'){
                openEmailVerifyModal();
            }else if(shortMsg === 'FROZEN'){
                openFlashToast(MessageTypes.ERROR, 'Your account is frozen and under review.');
            }else{
                openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
            }

        }else{
            openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
        }

    }

    const block = async () => {
        if(!checkAuthStatus()){
            return;
        }

        isControlProcessing.block = true;

        try{

            await axios.post('http://localhost:3001/api/v1/user-block-action', {
                action: 'block', 
                blocked_user_id: profileData.userId
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            profileData.followStatus = null;
            profileData.isBlocker = true;
            openFlashToast(MessageTypes.SUCCESS, `${username.value} now blocked.`);

        }catch(e){

            handleBlockUnblockResponseErrors(e);

        }finally{
            isControlProcessing.block = false;
        }
    }

    const unblock = async () => {

        try{
            isControlProcessing.unblock = true;

             await axios.post('http://localhost:3001/api/v1/user-block-action', {
                action: 'unblock', 
                blocked_user_id: profileData.userId
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });
            profileData.isBlocker = false;
            openFlashToast(MessageTypes.SUCCESS, `${username.value} has been unblocked.`);

        }catch(e){

            handleBlockUnblockResponseErrors(e);

        }finally{
            isControlProcessing.unblock = false;
        }

    }


    const follow = async () => {
        if(!checkAuthStatus()){
            return;
        }

        isControlProcessing.follow = true;

        try{

            await axios.post('http://localhost:3001/api/v1/user-follow-action', {
                followed_user_id: profileData.userId, 
                action: 'follow'
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            profileData.followStatus = 'PENDING';
            openFlashToast(MessageTypes.SUCCESS, 'Follow request has been sent.');

        }catch(e){

            console.error(e);

        }finally{
            isControlProcessing.follow = false;
        }
    }

    const unfollow = async () => {
        if(!checkAuthStatus()){
            return;
        }

        isControlProcessing.unfollow = false;

        try{

            await axios.post('http://localhost:3001/api/v1/user-follow-action', {
                followed_user_id: profileData.userId, 
                action: 'unfollow'
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            profileData.followStatus = null;

        }catch(e){

            console.error(e);

        }finally{
            isControlProcessing.unfollow = false;
        }

    }

    const handleSendMessageBtnClick = () => {
        if(!checkAuthStatus()){
            return;
        }

        if(profileData.isBlocked || profileData.isBlocker){
            openFlashToast(MessageTypes.ERROR, 'You have either blocked this user or are blocked by this user.');
            return;
        }

        openMessagesModal();

    }


    watch(() => getIsLoggedIn.value, (val) => {
         if(val === true){
            fetchMemberFacingProfile();
        }else{
            fetchPublicFacingProfile();
        }
    });

    watch(() => routeParams, (val) => {
        username.value = val.username;
    });

    onBeforeRouteUpdate((to) => {

        username.value = to.params.username;

    });


    onMounted(() => {
        if(getIsLoggedIn.value === true){
            fetchMemberFacingProfile();
        }else{
            fetchPublicFacingProfile();
        }
    });


</script>


<style lang="scss" scoped>

    .container{
        width:75%;
        margin: 2rem auto;
    }

    .profile-banner{

        height:12rem;
        background:linear-gradient(35deg, #21bf8f 50%, #33ab87 50%);;
        border-radius:.5rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        position:relative;

        &__img{
            width:14rem;
            height:14rem;
            border-radius:90%;
            border:2px solid #eee;
            background:#fff;
            position:absolute;
            bottom:-7rem;
            left:3rem;
            object-fit:cover;
            object-position:center;
        }

        &__username{
            font-size:2rem;
            color:#fff;
            position:absolute;
            bottom:1rem;
            left:20rem;
        }

        &__role-badge {
            position:absolute;
            right:1rem;
            top:1rem;
            padding:.5rem;
            background:linear-gradient(to bottom right, #2281ab, #3099c7);
            box-shadow:0 0 .5rem rgba(0,0,0,.24);
            color:#fff;
            font-size:1.2rem;
        }

    }

    .profile-grid {
        display:grid;
        grid-template-columns:20rem auto;
        grid-gap:2rem;
    }

    .control-pane{
        background:#fff;
        padding:1rem;
        margin-top:10rem;
        border-radius:.5rem;
        box-shadow:0 0 .25rem rgba(0,0,0,.24);

        &__btn{
            display:block;
            padding:1rem;
            background:linear-gradient(to bottom right, #11998e, #38ef7d);
            border:none;
            width:100%;
            border-radius:.5rem;
            font-weight:bold;
            color:transparent;
            background-clip:text;
            -webkit-background-clip:text;
            position:relative;


            &::before{
                content:"";
                position:absolute;
                left:0;
                top:0;
                height:100%;
                width:0;
                transition:all .5s;
                background:rgba(56, 239, 126,.08);
            }

            &:hover::before{
                width:100%;
            }

            i {
                margin-right:.5rem;
            }

            &:not(:last-child){
                border-bottom:1px solid #ddd;
            }

            .control-spinner{
                width:1.5rem;
            }
        }

    }

    .loading-spinner-container{
        display:flex;
        height:70vh;
        align-items:center;
        justify-content:center;
    }

    .loading-spinner{
        display:block;
    }

    .not-found,
    .error-loading-profile{
        height:70vh;
        display:flex;
        justify-content:center;
        align-items:center;

        &__content{
            color:#aaa;
            text-align:center;

            i{
                font-size:10rem;
            }

        }

        &__super-text{
            font-size:2rem;
        }

        &__text{
            font-size:4rem;
        }
    }

    .white-card{
        padding:1rem;
        box-shadow:0 0 .25rem rgba(0,0,0,.24);
        background:#fff;
        font-size:1.4rem;
        border-radius:.5rem;
        user-select:none;
        margin:1rem 0;

        &__key{
            margin-right:.5rem;
        }
    }

    .empty{
        color:#aaa;
    }

    .bio-card{
        min-height:22rem;
    }


    @media (max-width:700px) {

        .profile{
            padding:0 1rem;
        }

        .container {
            width:100%;
        }

        .profile-banner{
            position:static;
            padding:1rem;
            height:25rem;

            &__img{
                display:block;
                position:static;
                width:10rem;
                height:10rem;
                margin:auto;
                margin-top:2rem;
            }

            &__username{
                position:static;
                text-align:center;
                margin-top:2rem;
            }

            &__role-badge{
                position:static;
                width:10rem;
                text-align:center;
                display:block;
                margin:1rem auto;
            }
        }

        .profile-grid{
            display:block;
        }

        .control-pane{
            margin-top:2rem;
        }

    }

</style>