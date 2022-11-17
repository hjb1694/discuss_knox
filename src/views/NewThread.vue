<template>
    <div class="container">
        <div class="pane">
            <text-input 
            label="Headline" 
            input-type="text"
            v-model="headlineInput"
            max-length="125"
            />
        </div>
        <div class="pane">
            <app-multi-select 
            placeholder="Search or Select Channel" 
            :options="channelOpts"
            v-model="channelInput"
            />
        </div>
        <div class="pane">
            <quill-editor 
            theme="snow" 
            :toolbar="editorToolbar" 
            placeholder="Write something interesting..."
            content-type="html"
            v-model:content="contentInput"
            />
        </div>
        <button @click="submit">Submit</button>
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
            console.error(e);

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


    const submit = async () => {

        if(!validate()){
            return;
        }
        

    }


    onMounted(() => {
        fetchChannels();
    });
</script>

<style lang="scss" scoped>

    .container{
        width:60%;
        margin:2rem auto;
    }

    .pane{
        background:#fff;
        padding:1rem;

        &:not(:last-child){
            margin-bottom:2rem;
        }
    }

    @media (max-width:700px){
        .container{
            padding:1rem;
            width:100%;
        }
    }

</style>