<template>
    <div class="container">
        <form class="form" @submit.prevent>
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
                <button class="subbut" @click="submit('publish')">Publish</button>
                <button class="subbut" @click="submit('draft')">Save As Draft</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts" setup>
    import TextInput from '@/components/ui_elements/TextInput.vue';
    import AppMultiSelect from 'vue-multiselect';
    import { ref, reactive, onMounted } from 'vue';
    import axios from 'axios';
    import { QuillEditor } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import sanitizeHTML from 'sanitize-html';
    import stringLength from 'string-length';
    import { decode as htmlEntitiesDecode } from 'html-entities'; 
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';

    const { getAuthToken } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();

    const channelOpts = reactive([]);
    

    const headlineInput = ref<string>('');
    const channelInput = ref<string>('');
    const contentInput = ref<string>('');

    const editorToolbar = ['bold', 'italic', 'underline', 'image', {'list': 'ordered'}, {'list': 'bullet'}];

    const errors = reactive<string[]>([]);

    const fetchChannels = async () => {

        try{

            const response = await axios.get('http://localhost:3002/api/v1/channels');

            const opts = response.data.body.channels.map(channel => `c/${channel.channel_slug}`);

            channelOpts.push(...opts);

        }catch(e){
            
            openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');

        }

    }

    const stripTags = value => {

        return sanitizeHTML(value, {
            allowedTags: []
        });

    }

    const stripAllWS = value => {
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

        try{

            await axios.post(
                'http://localhost:3002/api/v1/thread', 
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

        }catch(e){
            if(e.response?.data?.short_msg){

                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_MAX_THREADS'){
                    openFlashToast(MessageTypes.ERROR, 'You have reached your peak limit for new threads for today.');
                }else{
                    openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
                }


            }else{
                openFlashToast(MessageTypes.ERROR, 'An unexpected error has occurred.');
            }
        }
        

    }


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

    .form{
        padding:1rem;
        background:#fff;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
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

    @media (max-width:800px){
        .container{
            padding:1rem;
            width:100%;
        }
    }

</style>