<template>
    <div class="container">
        <div class="thread">
            <header class="thread__header">
                <button @click="routerPush('/user/profile/' + threadData.author_username)" class="thread__author">
                    <i class="user-icon fa fa-user"></i>
                    <span>u/{{ threadData.author_username }}</span>
                    <strong v-if="getIsLoggedIn && (threadData.author_user_id === getUserData.user_id)" class="you">(You)</strong>
                </button>
            </header>
            <section class="thread__body">
                <h2 class="thread__headline">{{ threadData.headline }}</h2>
                <div class="thread__content" v-html="threadData.content"></div>
            </section>
        </div>
        <form class="opinion-form" v-if="isResponseFormShown" @submit.prevent>
            <h2>Add an Opinion</h2>
            <quill-editor 
            theme="snow"
            :toolbar="toolbar"
            placeholder="Write something interesting..."
            v-model:content="opinionInput"
            />
            <button @click="submitOpinion" class="btn" :disabled="isOpinionSubmissionProcessing">
              <span v-if="!isOpinionSubmissionProcessing">Submit</span>
              <span v-else>Processing...</span>
            </button>
        </form>
        <div class="auth-prompt" v-if="isAuthPromptShown">
            <p><a @click="openAuthModal">Login or Register</a> to add your opinion.</p>
        </div>
        <div v-if="isClosedPromptShown" class="closed-prompt">
            <p>This thread is closed.</p>
        </div>
        <div class="opinions">
            <h2>Opinions (0)</h2>

        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted, computed } from 'vue';
    import axios from 'axios';
    import { useRoute, useRouter } from 'vue-router';
    import { QuillEditor } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import sanitizeHTML from 'sanitize-html';
    import stringLength from 'string-length';
    import { decode as htmlEntityDecode } from 'html-entities';

    const { params: routeParams } = useRoute();
    const { push: routerPush } = useRouter();
    const { getIsLoggedIn, getUserData, getAuthToken } = useAuthStore();
    const { openAuthModal } = useCoreModalStore();

    const slug = ref<string>(routeParams.slug);
    const threadData = reactive({});
    const authUserOpinion = reactive({});
    const opinionSubmitErrors = reactive([]);
    const isOpinionSubmissionProcessing = ref<boolean>(false);

    const opinionInput = ref<string>('');

    const toolbar = ['bold', 'italic', 'underline', {'list': 'ordered'}, {'list': 'bullet'}];

    const isResponseFormShown = computed(() => {
        return getIsLoggedIn.value === true && 
        threadData.author_user_id !== getUserData.user_id &&
        threadData.status !== 'CLOSED' &&
        !authUserOpinion.username;
    });

    const isAuthPromptShown = computed(() => {
        return getIsLoggedIn.value === false &&
        threadData.status !== 'CLOSED';
    });

    const isClosedPromptShown = computed(() => {
        return threadData.status === 'CLOSED';
    });

    const fetchThread = async () => {

        try{

            const response = await axios.get(`http://localhost:3002/api/v1/thread/${slug.value}`);

            const thread = response.data.body.thread;

            const parser = new DOMParser();

            const dom = parser.parseFromString(thread.content, 'text/html');

            const images = dom.querySelectorAll('img');

            images.forEach(image => {
                const url = new URL(image.src);

                image.style.display = 'block';
                image.style.margin = '1rem auto';
                image.style.maxWidth = '300px';
                image.src = `http://localhost:3002/thread_img/${url.pathname.split('/')[2]}`;
            });

            thread.content = dom.body.innerHTML;

            for(let key in thread){
                threadData[key] = thread[key];
            }


        }catch(e){
            console.error(e);
        }

    }

    const stripTags = value => {
        return sanitizeHTML(value, {
            allowedTags: []
        })
    }

    const stripAllWS = value => {
        let stripped = value.replace(/ +/g,'');
        stripped = value.replace(/\n+/g,'');
        stripped = value.replace(/\s+/g,'');
        return stripped;
    }

    const opinionValidation = () => {

        opinionSubmitErrors.splice(0,opinionSubmitErrors.length);
        let isValid = true;

        if(stringLength(htmlEntityDecode(stripAllWS(stripTags(contentInput.value)))) < 20){
            isValid = false;
            opinionSubmitErrors.push('Opinion is too short.');
        }

        if(stringLength(htmlEntityDecode(stripAllWS(stripTags(contentInput.value)))) > 3000){
            isValid = false;
            opinionSubmitErrors.push('Opinion is too long.');
        }

        return isValid;

    }

    const submitOpinion = async () => {

        if(!opinionValidation()){
            return;
        }

        isOpinionSubmissionProcessing.value = true;

        try{

            await axios.post('http://localhost:3002/api/v1/opinions', 
            {
                thread_id: threadData.id, 
                content: contentInput.value
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

        }catch(e){
            console.error(e);
        }finally{
            isOpinionSubmissionProcessing.value = false;
        }


    }

    onMounted(() => {
        fetchThread();
    });


</script>

<style lang="scss" scoped>
    .container{
        width:75%;
        padding:1rem;
        margin:2rem auto;
    }

    .thread{
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        border-radius:.5rem;
        overflow:hidden;

        &__header{
            background:#33ab87;
            padding:1rem;
            font-size:1.4rem;
        }

        &__author{
            background:transparent;
            border:none;
            color:#fff;
        }

        &__body{
            min-height:20rem;
            background:#fff;
            padding:1rem;
        }

        &__headline{
            font-size:1.8rem;
            color:#555;
        }

        &__content{
            font-size:1.4rem;
            margin-top:1rem;
        }

        .user-icon{
            margin-right:.5rem;
        }
    }

    .opinion-form, 
    .auth-prompt {
        background:#fff;
        padding:2rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        margin:2rem 0;
        border-radius:.5rem;

        h2{
            font-size:2.2rem;
            margin-bottom:1rem;
        }
    }

    .btn{
        display:inline-block;
        background:#21bf8f;
        border:none;
        padding:.8rem 1.2rem;
        color:#fff;
        font-size:1.6rem;
        font-weight:bold;
        border-radius:.5rem;
        margin:1rem 0;
    }

    .auth-prompt, 
    .closed-prompt{
        font-size:1.6rem;

        a{
            color:#11998e;
        }
    }

    .opinions{
        margin:2rem 0;

        h2{
            font-size:2.2rem;
        }
    }

    .you{
        margin-left:.5rem;
    }

    @media (max-width: 800px) {

        .container{
            width:100%;
        }
    }
</style>