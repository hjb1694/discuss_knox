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
        </template>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import BigErrorDisplay from '@/components/BigErrorDisplay/BigErrorDisplay.vue';
import axios from 'axios';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const { params: routeParams } = useRoute();

const isChannelLoading = ref<boolean>(true);
const isErrorLoadingChannel = ref<boolean>(false);
const channelInfo = reactive({
    name: '',
    slug: '', 
    rules: []
});
const slug = ref(routeParams.slug);


const loadChannelInfo = async () => {

    isChannelLoading.value = true;

    try{

        const response = await axios.get(`http://155.138.197.17:8080/api/v1/channel-info/${slug.value}`);

        console.log(response);

        const channelInfoData = response.data.body.channel_info;

        channelInfo.name = channelInfoData.channel_name;
        channelInfo.slug = channelInfoData.channel_slug;
        channelInfo.rules = channelInfoData.rules;

    }catch(e: any){
        isErrorLoadingChannel.value = true;
    }finally{
        isChannelLoading.value = false;
    }


}

onBeforeRouteUpdate((to) => {

    slug.value = to.params.slug;
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

    @media (max-width: 800px) {

        .container{
            width:100%;
        }

    }
</style>