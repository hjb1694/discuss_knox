<template>
    <div class="container">
        <button v-if="newThreadsToLoad.length" class="load-new-btn btn center" @click="loadNewerThreads">Load New Threads ({{ newThreadsToLoad.length }})</button>
        <div class="threads">
            <div v-for="thread in shownThreads" :key="thread.id" class="thread-tile">
                <img v-if="!thread.main_image" src="@/assets/sunsphere_tower.jpg" class="thread-tile__image"/>
                <img v-else :src="'http://localhost:3002/thread_img/' + thread.main_image" class="thread-tile__image"/>
                <div class="thread-tile__body">
                    <h2 @click="routerPush('/thread/' + thread.slug)">{{ thread.headline.substring(0,75) }}...</h2>
                </div>
                <div class="thread-tile__footer">
                    <button @click="routerPush('/user/profile/' + thread.author_username)" class="thread-tile__author">
                        <i class="user-icon fa fa-user"></i>
                        <span>u/{{ thread.author_username }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import Pusher from 'pusher-js';

    const { push: routerPush} = useRouter();

    const shownThreads = reactive([]);
    const newThreadsToLoad = reactive([]);

    const maxId = ref<number | null>(null);

    const pusher = reactive({
        instance: null, 
        channel: null
    });


    const loadNewerThreads = () => {

        shownThreads.unshift(...newThreadsToLoad);

        newThreadsToLoad.splice(0,newThreadsToLoad.length);

    }

    const listenForNewThreads = () => {

        pusher.channel.bind('new-thread', data => {
            newThreadsToLoad.unshift(data);
        });

    }

    const createPusherInstance = () => {

        pusher.instance = new Pusher('f5ea34c17095fbb4548a');

        pusher.channel = pusher.instance.subscribe('live-feed');

        listenForNewThreads();

    }

    const loadThreads = async () => {

        try{

            if(maxId.value !== null && maxId.value < 1){
                return;
            }

            const response = await axios.get(`http://localhost:3002/api/v1/thread?maxId=${maxId.value}`);

            const threads = response.data.body.threads;

            maxId.value = Math.min(...threads.map(thread => +thread.id)) - 1;

            shownThreads.push(...threads);

        }catch(e){
            console.error(e);
        }

    }


    onMounted(() => {
        loadThreads();
        createPusherInstance();
    });


</script>

<style lang="scss" scoped>

    .container{
        width:75%;
        padding:1rem;
        margin:2rem auto;
    }

    .threads{
        display:flex;
        flex-wrap:wrap;
        margin-top:1.75rem;
    }

    .thread-tile{
        width:25rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        margin-right:2rem;
        margin-bottom:2rem;

        &__image{
            display:block;
            width:100%;
            height:15rem;
            object-fit:cover;
            object-position:center;
            background:#fff;
        }

        &__body{
            padding:1rem;
            background:#fff;

            h2{
                color:#888;
                cursor:pointer;
            }
        }

        &__author{
            border:none;
            background:transparent;
            color:#555;
        }

        &__footer{
            padding:1rem;
            background:#fafafa;

            .user-icon{
                margin-right:.5rem;
            }
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

        &.center{
            margin:0 auto;
        }

    }

    .load-new-btn{
        margin-bottom:2rem;
        animation: rise 1s alternate infinite;
    }


    @media (max-width: 800px) {

        .container{
            width:100%;
        }

        .threads{
            justify-content:center;
        }

        .thread-tile{
            width:30rem;

            &__image{
                height:17rem;
            }
        }

    }

    @media (max-width: 600px) {

        .thread-tile {
            margin-right:0;
        }

    }

    @keyframes rise{
        from{
            transform:translateY(0);
        }
        to{
            transform:translateY(1rem);
        }
    }

</style>