<template>
    <div class="container">
        <form class="form pane" @submit.prevent>
            <h2 class="pane__heading">Compose New Thread</h2>
            <div class="pane__body">
                <div class="fgrp">
                    <text-input 
                    label="Headline" 
                    input-type="text"
                    v-model="headlineInput"
                    max-length="125"
                    />
                </div>
                <div class="fgrp">
                    <app-multi-select 
                    placeholder="Search or Select Channel" 
                    :options="channelOpts"
                    v-model="channelInput"
                    />
                </div>
                <div class="fgrp">
                    <quill-editor 
                    theme="snow" 
                    :toolbar="editorToolbar" 
                    placeholder="Write something interesting..."
                    content-type="html"
                    v-model:content="contentInput"
                    />
                </div>
                <div class="fgrp">
                    <button class="subbut" @click="submit('publish')" :disabled="isSubmissionProcessing">
                        <span v-if="!isPublishProcessing">Publish</span>
                        <span v-else>Processing...</span>
                    </button>
                    <!-- <button class="subbut" @click="submit('draft')" :disabled="isSubmissionProcessing">Save As Draft</button> -->
                </div>
                <div v-if="errors.length" class="errbox">
                    <p v-for="error in errors" :key="error">{{ error }}</p>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
    import TextInput from '@/components/ui_elements/TextInput.vue';
    import AppMultiSelect from 'vue-multiselect';
    import { ref, reactive, onMounted, watch } from 'vue';
    import axios from 'axios';
    import { QuillEditor } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import sanitizeHTML from 'sanitize-html';
    import stringLength from 'string-length';
    import { decode as htmlEntitiesDecode } from 'html-entities'; 
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import { useRouter } from 'vue-router';

    const { getIsLoggedIn, getAuthToken, logout, getUserData } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();
    const { push: routerPush } = useRouter();

    const channelOpts = reactive<string[]>([]);
    

    const headlineInput = ref<string>('');
    const channelInput = ref<string>('');
    const contentInput = ref<string>('');
    const isSubmissionProcessing = ref<boolean>(false);
    const isPublishProcessing = ref<boolean>(false);

    const editorToolbar = ['bold', 'italic', 'underline', 'image', {'list': 'ordered'}, {'list': 'bullet'}];

    const errors = reactive<string[]>([]);

    const fetchChannels = async () => {

        try{

            const response = await axios.get('https://www.ktpdiscussapi.com/api/v1/channels');

            const opts = response.data.body.channels.map((channel: any) => `c/${channel.channel_slug}`);

            channelOpts.push(...opts);

        }catch(e){
            
            openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');

        }

    }

    const stripTags = (value: string) => {

        return sanitizeHTML(value, {
            allowedTags: []
        });

    }

    const stripAllWS = (value: string) => {
        let stripped = value.replace(/ +/g,'');
        stripped = value.replace(/\n+/g,'');
        stripped = value.replace(/\s+/g,'');
        return stripped;
    }

    const validate = () => {

        let isValid = true;
        errors.splice(0,errors.length);

        if(stringLength(stripAllWS(stripTags(htmlEntitiesDecode(headlineInput.value)))) < 15){
            isValid = false;
            errors.push('Headline is too short.');
        }

        if(!channelInput.value){
            isValid = false;
            errors.push('Please select a channel.');
        }

        if(stringLength(stripAllWS(htmlEntitiesDecode(stripTags(contentInput.value)))) < 100){
            isValid = false;
            errors.push('Content is too short.');
        }

        if(stringLength(stripAllWS(htmlEntitiesDecode(stripTags(contentInput.value)))) > 4000){
            isValid = false;
            errors.push('Content is too long.');
        }

        const parser = new DOMParser();

        const dom = parser.parseFromString(contentInput.value, 'text/html');

        const imgCount = dom.querySelectorAll('img').length;

        if(imgCount > 2){
            isValid = false;
            errors.push('Only 2 images allowed.');
        }



        return isValid;


    }


    const submit = async (action: string) => {

        if(!validate()){
            return;
        }

        isSubmissionProcessing.value = true;

        if(action === 'publish'){
            isPublishProcessing.value = true;
        }

        try{

            const response = await axios.post(
                'https://www.ktpdiscussapi.com/api/v1/thread', 
                {
                    action, 
                    headline: headlineInput.value.trim(), 
                    channel: channelInput.value.substring(2), 
                    content: contentInput.value.trim()
                }, 
                {
                    headers: {
                        'x-auth-token': getAuthToken.value
                    }
                }
            );

            const shortMsg = response.data.short_msg;

            if(shortMsg === 'SUCCESS_PUBLISHED'){

                routerPush(`/thread/${response.data.body.slug}`);

            }else if(shortMsg === 'SUCCESS_DRAFT_SAVED'){

                openFlashToast(MessageTypes.SUCCESS, 'Draft saved.');
                routerPush(`/user/profile/${getUserData.username}`);

            }

        }catch(e: any){
            if(e.response?.data?.short_msg){

                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_MAX_THREADS'){
                    openFlashToast(MessageTypes.ERROR, 'You have reached your peak limit for new threads for today.');
                }else if(shortMsg === 'ERR_DEACTIVATION'){
                    openFlashToast(MessageTypes.ERROR, 'Account deactivated.')
                    logout();
                    routerPush('/');
                }else if(shortMsg === 'ERR_FROZEN'){
                    openFlashToast(MessageTypes.ERROR, 'Your account has been frozen and under review by admins.');
                }else{
                    openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
                }


            }else{
                openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
            }
        }finally{
            isSubmissionProcessing.value = false;

            if(action === 'publish'){
                isPublishProcessing.value = false;
            }
        }
        

    }

    watch(getIsLoggedIn, (value) => {

        if(value === false){
            routerPush('/');
        }

    });


    onMounted(() => {
        fetchChannels();
    });
</script>

<style lang="scss" scoped>

    .container{
        width:65%;
        margin:2rem auto;
        padding:1rem;
    }

    .pane{
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        border-radius:.5rem;
        overflow:hidden;

        &__heading{
            background:#33ab87;
            color:#fff;
            padding:1rem;
        }

        &__body{
            padding:1rem;
            background:#fff;
        }
    }

    .fgrp{
        margin:2rem 0;
    }

    .subbut{
        display:inline-block;
        background:#21bf8f;
        border:none;
        padding:.8rem 1.2rem;
        color:#fff;
        font-size:1.6rem;
        font-weight:bold;
        border-radius:.5rem;

        &:not(:last-child){
            margin-right:1rem;
        }
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

    @media (max-width:800px){
        .container{
            padding:1rem;
            width:100%;
        }
    }

</style>