<template>
    <div class="container">
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
            <header class="pane__header">Reset Password</header>
            <section class="pane__body">
                <form @submit.prevent>
                    <div class="fgrp">
                        <text-input label="Current Password"/>
                    </div>
                    <div class="fgrp">
                        <text-input label="New Password"/>
                    </div>
                    <div class="fgrp">
                        <text-input label="Confirm New Password"/>
                    </div>
                </form>
            </section>
            <footer class="pane__footer">
                <button type="button" class="btn">Reset Password</button>
            </footer>
        </div>
        <div class="pane">
            <header class="pane__header">Deactivate Account</header>
            <section class="pane__body">
                <p>This is a permanant action. Deactivating your account will NOT remove your posts or other contributing content.</p>
                <form @submit.prevent>
                    <h3>Please provide reason(s):</h3>
                    <div class="fgrp">
                        <checkbox-input input-id="other-users" label="Other users"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="taking-break" label="Taking a break"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="bugs" label="Technical problems/bugs on the platform"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="little-use" label="Don't use this platform enough"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="other-reason" label="Another reason not listed"/>
                    </div>
                </form>
            </section>
            <footer class="pane__footer">
                <button type="button" class="btn">Deactivate My Account</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import CheckboxInput from '@/components/ui_elements/CheckboxInput.vue';
    import TextInput from '@/components/ui_elements/TextInput.vue';
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';

    const { getAuthToken, getUserData } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();

    const isProfilePrivate = ref<boolean>(false);


    const updateProfilePrivacy = async () => {
        try{

            await axios.patch('http://66.42.81.246:8080/api/v1/profile-privacy', {
                is_private: isProfilePrivate.value ? 'yes' : 'no'
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

    @media (max-width:700px){
        .container{
            width:100%;
            padding:1rem;
        }
    }
</style>