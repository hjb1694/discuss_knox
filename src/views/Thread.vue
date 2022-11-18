<template>
    <div class="container">
        <div class="thread">
            <header class="thread__header">
                <button @click="routerPush('/user/profile/' + threadData.author_username)" class="thread__author">
                    <i class="user-icon fa fa-user"></i>
                    <span>u/{{ threadData.author_username }}</span>
                </button>
            </header>
            <section class="thread__body">
                <h2 class="thread__headline">{{ threadData.headline }}</h2>
                <div class="thread__content" v-html="threadData.content"></div>
            </section>
        </div>
        <form class="opinion-form" v-if="showResponseForm" @submit.prevent>
            <h2>Add an Opinion</h2>
            <quill-editor 
            theme="snow"
            :toolbar="toolbar"
            placeholder="Write something interesting..."
            />
            <button class="btn">Submit</button>
        </form>
        <div class="auth-prompt" v-if="showAuthPrompt">
            <p><a @click="openAuthModal">Login or Register</a> to add your opinion.</p>
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

    const { params: routeParams } = useRoute();
    const { push: routerPush } = useRouter();
    const { getIsLoggedIn, getUserData } = useAuthStore();
    const { openAuthModal } = useCoreModalStore();

    const slug = ref<string>(routeParams.slug);
    const threadData = reactive({});

    const toolbar = ['bold', 'italic', 'underline', {'list': 'ordered'}, {'list': 'bullet'}];

    const showResponseForm = computed(() => {
        return getIsLoggedIn.value === true && threadData.author_user_id !== getUserData.user_id;
    });

    const showAuthPrompt = computed(() => {
        return getIsLoggedIn.value === false;
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

    .auth-prompt{
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

    @media (max-width: 800px) {

        .container{
            width:100%;
        }
    }
</style>