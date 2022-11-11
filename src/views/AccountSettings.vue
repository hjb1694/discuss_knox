<template>
    <div class="container">
        <processing-overlay v-if="isDeactivationProcessing"/>
        <deactivation-confirmation-modal :is-open="isDeactivationModalOpen" @selection="deactivateAccount($event)" />
        <div class="pane">
            <header class="pane__header">Privacy</header>
            <section class="pane__body">
                <checkbox-input v-model="isProfilePrivate" input-id="private-profile" label="Set Profile Private"/>
            </section>
            <footer class="pane__footer">
                <button class="btn" @click="updateProfilePrivacy">Save Changes</button>
            </footer>
        </div>
        <div class="pane">
            <header class="pane__header">Change Password</header>
            <section class="pane__body">
                <form @submit.prevent>
                    <div class="fgrp">
                        <text-input v-model="currentPassword" input-type="password" label="Current Password" :disabled="changePasswordProcessing"/>
                    </div>
                    <div class="fgrp">
                        <text-input v-model="newPassword" input-type="password" label="New Password" :disabled="changePasswordProcessing"/>
                    </div>
                    <div class="fgrp">
                        <text-input v-model="confirmNewPassword" input-type="password" label="Confirm New Password" :disabled="changePasswordProcessing"/>
                    </div>
                </form>
                <div v-if="changePasswordErrors.length" class="errbox">
                    <p v-for="error in changePasswordErrors" :key="error">{{ error }}</p>
                </div>
            </section>
            <footer class="pane__footer">
                <button type="button" class="btn" @click="changePassword" :disabled="changePasswordProcessing">
                    <span v-if="!changePasswordProcessing">Submit</span>
                    <span v-else>Processing...</span>
                </button>
            </footer>
        </div>
        <div class="pane">
            <header class="pane__header">Deactivate Account</header>
            <section class="pane__body">
                <p>This is a permanant action. Deactivating your account will NOT remove your posts or other contributing content.</p>
                <form @submit.prevent>
                    <h3>Please provide reason(s):</h3>
                    <div class="fgrp">
                        <checkbox-input v-model="deactivateReasonOtherUsers" input-id="other-users" label="Other users"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input v-model="deactivateReasonTakingBreak" input-id="taking-break" label="Taking a break"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input v-model="deactivateReasonBugs" input-id="bugs" label="Technical problems/bugs on the platform"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input v-model="deactivateReasonDontUse" input-id="little-use" label="Don't use this platform enough"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input v-model="deactivateReasonAnotherReason" input-id="other-reason" label="Another reason not listed"/>
                    </div>
                </form>
                <div v-if="deactivationErrors.length" class="errbox">
                    <p v-for="error in deactivationErrors" :key="error">{{ error }}</p>
                </div>
            </section>
            <footer class="pane__footer">
                <button type="button" class="btn" @click="openConfirmationModal">Deactivate My Account</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import CheckboxInput from '@/components/ui_elements/CheckboxInput.vue';
    import TextInput from '@/components/ui_elements/TextInput.vue';
    import { ref, onMounted, watch, reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import stringLength from 'string-length';
    import DeactivationConfirmationModal from '@/components/DeactivationConfirmationModal/DeactivationConfirmationModal.vue';
    import ProcessingOverlay from '@/components/ProcessingOverlay/ProcessingOverlay.vue';

    const { getAuthToken, getUserData, getIsLoggedIn, logout } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();
    const { push: routerPush} = useRouter();

    const isProfilePrivate = ref<boolean>(false);

    const currentPassword = ref<string>('');
    const newPassword = ref<string>('');
    const confirmNewPassword = ref<string>('');
    const changePasswordErrors = reactive<string[]>([]);
    const changePasswordProcessing = ref<boolean>(false);

    const deactivateReasonOtherUsers = ref<boolean>(false);
    const deactivateReasonTakingBreak = ref<boolean>(false);
    const deactivateReasonBugs = ref<boolean>(false);
    const deactivateReasonDontUse = ref<boolean>(false);
    const deactivateReasonAnotherReason = ref<boolean>(false);

    const deactivationErrors = reactive<string[]>([]);

    const isDeactivationModalOpen = ref<boolean>(false);

    const isDeactivationProcessing = ref<boolean>(false);


    const updateProfilePrivacy = async () => {
        try{

            console.log(isProfilePrivate.value);

            await axios.patch('http://66.42.81.246:8080/api/v1/profile-privacy', {
                is_private: isProfilePrivate.value === true ? 'yes' : 'no'
            }, 
            {
               headers: {
                   'x-auth-token': getAuthToken.value
               }
            });

            openFlashToast(MessageTypes.SUCCESS, 'Profile privacy updated.');

        }catch(e){
            console.error(e);
        }
    }

    const fetchProfilePrivacy = async () => {

        try{

            const response = await axios.get(`http://66.42.81.246:8080/api/v1/profile-privacy/${getUserData.user_id}`);

            isProfilePrivate.value = response.data.body.is_profile_private;

        }catch(e){
            console.error(e);
        }


    }

    const validateChangePassword = () => {
        changePasswordErrors.splice(0,changePasswordErrors.length);
        let isValid = true;

        const passwordRegs = {
            uppercase: /[A-Z]/, 
            lowercase: /[a-z]/, 
            numeric: /[0-9]/
        }

        if(stringLength(currentPassword.value) < 1){
            changePasswordErrors.push('Please enter your current password.'); 
            isValid = false;
        }

        if(
                !passwordRegs.uppercase.test(newPassword.value) ||
                !passwordRegs.lowercase.test(newPassword.value) ||
                !passwordRegs.numeric.test(newPassword.value) ||
                stringLength(newPassword.value) < 8 || 
                stringLength(newPassword.value) > 50
        ){
            changePasswordErrors.push('Password must be between 8 and 50 characters and contain at least 1 uppercase letter, one lowercase letter, and one number.');
            isValid = false;
        }

        if(newPassword.value !== confirmNewPassword.value){
            changePasswordErrors.push('Confirm password does not match.');
            isValid = false;
        }

        return isValid;
    }


    const changePassword = async () => {

        if(!validateChangePassword()){
            return;
        }

        changePasswordProcessing.value = true;

        try{

            await axios.patch('http://66.42.81.246:8080/api/v1/change-password', {
                current_password: currentPassword.value, 
                new_password: newPassword.value
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            currentPassword.value = '';
            newPassword.value = '';
            confirmNewPassword.value = '';
            openFlashToast(MessageTypes.SUCCESS, 'Password successfully changed!');

        }catch(e){

            if(e.response?.data?.short_msg){

                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_DEACTIVATED'){
                    openFlashToast(MessageTypes.ERROR, 'Your account has been deactivated.');
                    logout();
                }else if(shortMsg === 'ERR_PASSWORD_NOT_MATCHES'){
                    changePasswordErrors.push('Incorrect current password.');
                }else{
                    openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
                }

            }else{
                openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
            }

        }finally{
            changePasswordProcessing.value = false;
        }

    }

    const deactivationValidation = () => {

        deactivationErrors.splice(0,deactivationErrors.length);

        if(
            !deactivateReasonOtherUsers.value &&
            !deactivateReasonTakingBreak.value &&
            !deactivateReasonBugs.value &&
            !deactivateReasonDontUse.value && 
            !deactivateReasonAnotherReason.value
        ){
            deactivationErrors.push('Please select at least one reason.');
            return false;
        }

        return true;

    }

    const openConfirmationModal = () => {

        if(!deactivationValidation()){
            return;
        }

        isDeactivationModalOpen.value = true;
    }

    const deactivateAccount = (value) => {
        isDeactivationModalOpen.value = false;
        isDeactivationProcessing.value = true;
        
        try{

            await axios.patch('http://66.42.81.246:8080/api/v1/self-deactivation', {
                reason_other_users: deactivateReasonOtherUsers.value, 
                reason_taking_break: deactivateReasonTakingBreak.value, 
                reason_bugs: deactivateReasonBugs.value, 
                reason_dont_use: deactivateReasonDontUse.value, 
                reason_other: deactivateReasonAnotherReason.value
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            openFlashToast(MessageTypes.SUCCESS, 'Account successfully deactivated!');
            logout();

        }catch(e){

            openFlashToast(MessageTypes.ERROR, 'An error has occurred.');

        }finally{
            isDeactivationProcessing.value = false;
        }
    }

    watch(getIsLoggedIn, (val) => {

        if(val === false){
            routerPush('/');
        }

    });

    onMounted(() => {
        fetchProfilePrivacy();
    });

</script>

<style lang="scss" scoped>
    .container{
        width:60%;
        margin:2rem auto;
    }

    .pane{
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        border-radius:.5rem;
        overflow:hidden;

        &__header{
            padding:1rem;
            background:#33ab87;
            color:#fff;
            font-size:1.6rem;
        }

        &__body{
            background:#fff;
            padding:1rem;
        }

        &__footer{
            padding:1rem;
            background:#fff;
            border-top:1px solid #ccc;
        }

        p{
            font-size:1.4rem;
        }

        h3{
            font-size:1.4rem;
            margin:1rem 0;
        }

        &:not(:last-child){
            margin-bottom:2rem;
        }

    }

    .btn{
        display:block;
        background:#21bf8f;
        border:none;
        padding:.8rem 1.2rem;
        color:#fff;
        font-size:1.6rem;
        font-weight:bold;
        border-radius:.5rem;
    }

    .fgrp{
        margin:1rem 0;
    }

    .errbox{
        color:#f00;
        margin-top:2rem;
        font-size:1.4rem;
        background:#ffe0de;
        border:1px solid #f00;
        padding:1rem;
        border-radius:.5rem;
    }

    @media (max-width:700px){
        .container{
            width:100%;
            padding:1rem;
        }
    }
</style>