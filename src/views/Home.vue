<template>
    <div class="container">
        <div class="banner">
            <p class="banner__heading-text">Live Feed</p>
        </div>
        <button v-if="!isInitialLoadProcessing && newThreadsToLoad.length" class="load-new-btn btn center" @click="loadNewerThreads">Load New Threads ({{ newThreadsToLoad.length }})</button>
        <div v-if="isInitialLoadProcessing" class="load-spinner-container">
            <img src="@/assets/ring-spinner.svg" class="load-spinner"/>
        </div>
        <div v-else-if="isInitialLoad && !shownThreads.length" class="no-activity">
            <p>No activity at the moment :(</p>
        </div>
        <template v-else>
            <div class="threads">
                <div v-for="thread in shownThreads" :key="thread.id" class="thread-tile">
                    <img v-if="!thread.main_image" src="@/assets/sunsphere_tower.jpg" class="thread-tile__image"/>
                    <img v-else :src="'http://155.138.197.17:8080/thread_img/' + thread.main_image" class="thread-tile__image"/>
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
            <button v-if="isOlderThreadBtnShown" class="btn center" @click="loadThreads">Load Older Threads</button>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import Pusher from 'pusher-js';

    const { push: routerPush} = useRouter();

    const shownThreads = reactive([]);
    const newThreadsToLoad = reactive([]);
    const isOlderThreadBtnShown = ref<boolean>(true);
    const isInitialLoad = ref<boolean>(true);
    const isInitialLoadProcessing = ref<boolean>(true);

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

            const response = await axios.get(`http://155.138.197.17:8080/api/v1/thread?maxId=${maxId.value}`);

            const threads = response.data.body.threads;

            maxId.value = Math.min(...threads.map(thread => +thread.id)) - 1;

            shownThreads.push(...threads);

            if(threads.length < 10){
                isOlderThreadBtnShown.value = false;
            }

            if(threads.length){
                isInitialLoad.value = false;
            }

        }catch(e){
            console.error(e);
        }finally{
            isInitialLoadProcessing.value = false;
        }

    }


    onMounted(() => {
        loadThreads();
        createPusherInstance();
    });

    onUnmounted(() => {
        pusher.channel = null;
        pusher.instance.unsubscribe();
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
        border:1px solid #ccc;
        margin-right:2rem;
        margin-bottom:2rem;
        background:#fff;
        padding:1rem;

        &__image{
            display:block;
            width:100%;
            height:15rem;
            object-fit:cover;
            object-position:center;
            background:#fff;
        }

        &__body{
            padding:1rem 0;
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
            padding:1rem 0;

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

    .load-spinner-container{
        height:70vh;
        display:flex;
        align-items:center;
        justify-content:center;
    }

    .load-spinner{
        width:10rem;
    }

    .no-activity p{
        text-align:center;
        margin:2rem 0;
        color:#888;
        font-size:1.4rem;
    }

    .banner{
        height:8rem;
        background:linear-gradient(35deg, #21bf8f 50%, #33ab87 50%);;
        border-radius:.5rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        position:relative;

        &__heading-text{
            font-size:2rem;
            position:absolute;
            left:2rem;
            bottom:1rem;
            color:#fff;
        }
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