<template>
    <div class="container">
        <div class="pane">
            <text-input label="Headline" input-type="text"/>
        </div>
        <div class="pane">
            <app-multi-select placeholder="Search or Select Channel" :options="channelOpts"/>
        </div>
        <div class="pane">
            <quill-editor theme="snow" :toolbar="editorToolbar" placeholder="Write something interesting..."/>
        </div>
        <button>Submit</button>
    </div>
</template>

<script lang="ts" setup>
    import TextInput from '@/components/ui_elements/TextInput.vue';
    import AppMultiSelect from 'vue-multiselect';
    import { ref, reactive, onMounted } from 'vue';
    import axios from 'axios';
    import { QuillEditor } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';

    const channelOpts = reactive([]);

    const editorToolbar = ['bold', 'italic', 'underline', 'image'];

    const fetchChannels = async () => {

        try{

            const response = await axios.get('http://localhost:3002/api/v1/channels');

            const opts = response.data.body.channels.map(channel => `c/${channel.channel_slug}`);

            channelOpts.push(...opts);

        }catch(e){
            console.error(e);

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