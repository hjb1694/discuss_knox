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
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from 'vue';
    import axios from 'axios';
    import { useRoute, useRouter } from 'vue-router';

    const { params: routeParams } = useRoute();
    const { push: routerPush } = useRouter();

    const slug = ref<string>(routeParams.slug);
    const threadData = reactive({});

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
                image.src = `http://localhost:3002/thread_img/${url.pathname.split('/')[2]}`;
            });

            console.log(dom.body.innerHTML);

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
            font-size:1.6rem;
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

    @media (max-width: 800px) {

        .container{
            width:100%;
        }
    }
</style>