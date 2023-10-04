<template>
    <div class="container">
        <div v-if="isChannelLoading" class="load-spinner-container">
            <img src="@/assets/ring-spinner.svg" alt="Loading..." class="load-spinner"/>
        </div>
        <big-error-display v-else-if="isErrorLoadingChannel" message="Failed to load channel"/>
        <template v-else>
            <div class="banner">
                <h2 class="banner__heading-text">{{ channelInfo.name }}</h2>
                <h3 class="banner__heading-subtext">c/{{ channelInfo.slug }}</h3>
            </div>
            <div v-if="isThreadsLoading" class="load-spinner-container">
                <img src="@/assets/ring-spinner.svg" alt="Loading..." class="load-spinner"/>
            </div>
            <div v-else-if="isErrorLoadingThreads" class="threads-error">
                <p>There was an error loading threads. :(</p>
            </div>
            <div v-else-if="!shownThreads.length" class="threads-error">
                <p>No activity in this channel :(</p>
            </div>
            <div v-else class="threads">
                <div v-for="thread in shownThreads" :key="thread.id" class="thread-tile">
                    <img v-if="!thread.main_image" src="@/assets/sunsphere_tower.jpg" class="thread-tile__image"/>
                    <img v-else :src="'http://159.89.82.146:3002/thread_img/' + thread.main_image" class="thread-tile__image"/>
                    <div class="thread-tile__body">
                        <h2 @click="routerPush('/thread/' + thread.slug)">{{ thread.headline!.substring(0,75) }}...</h2>
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
import { ref, reactive, onMounted } from 'vue';
import BigErrorDisplay from '@/components/BigErrorDisplay/BigErrorDisplay.vue';
import axios from 'axios';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import type { ThreadData } from '@/types';

const { params: routeParams } = useRoute();
const { push: routerPush } = useRouter();

const isChannelLoading = ref<boolean>(true);
const isErrorLoadingChannel = ref<boolean>(false);
const channelInfo = reactive({
    id: 0,
    name: '',
    slug: '', 
    rules: []
});
const slug = ref(routeParams.slug);
const isThreadsLoading = ref<boolean>(true);
const isErrorLoadingThreads = ref<boolean>(false);
const isOlderThreadBtnShown = ref<boolean>(true);
const shownThreads = reactive<ThreadData[]>([]);

const maxId = ref<number | null>(null);


const loadThreads = async () => {

    if(maxId.value !== null && maxId.value < 1){
        return;
    }

    isThreadsLoading.value = true;

    try{

        const response = await axios.get(`http://159.89.82.146:3002/api/v1/threads-by-channel/${channelInfo.id}?maxId=${maxId.value}`);

        const threads = response.data.body.threads;

        maxId.value = Math.min(...threads.map((thread: any) => +thread.id)) - 1;

        shownThreads.push(...threads);

        if(threads.length < 10){
            isOlderThreadBtnShown.value = false;
        }

    }catch(e){
        isErrorLoadingThreads.value = true;
    }finally{
        isThreadsLoading.value = false;
    }

}


const loadChannelInfo = async () => {

    isChannelLoading.value = true;

    try{

        const response = await axios.get(`http://159.89.82.146:3002/api/v1/channel-info/${slug.value}`);

        console.log(response);

        const channelInfoData = response.data.body.channel_info;

        channelInfo.id = channelInfoData.id
        channelInfo.name = channelInfoData.channel_name;
        channelInfo.slug = channelInfoData.channel_slug;
        channelInfo.rules = channelInfoData.rules;

        loadThreads();

    }catch(e: any){
        isErrorLoadingChannel.value = true;
    }finally{
        isChannelLoading.value = false;
    }


}

onBeforeRouteUpdate((to) => {

    shownThreads.splice(0, shownThreads.length);
    slug.value = to.params.slug;
    maxId.value = null;
    loadChannelInfo();

})

onMounted(() => {
    loadChannelInfo();
});

</script>

<style lang="scss" scoped>
     .container{
        width:75%;
        padding:1rem;
        margin:2rem auto;
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

    .banner{
        height:8rem;
        background:linear-gradient(35deg, #21bf8f 50%, #33ab87 50%);;
        border-radius:.5rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        padding:1rem;

        &__heading-text{
            font-size:2rem;
            color:#fff;
            font-weight: normal;
        }

        &__heading-subtext{
            font-size:1.2rem;
            color:#fff;
            font-weight: normal;
        }
    }

    .threads-error{
        margin-top:2rem;

        p{
            font-size:1.4rem;
            color:#888;
            text-align: center;
        }
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
                color:#2C414F;
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

    @media (max-width: 800px) {

        .container{
            width:100%;
        }

    }
</style>
