<template>
    <div class="container">
        <div class="threads">
            <div v-for="thread in shownThreads" :key="thread.id" class="thread-tile">
                <img src="@/assets/no_image.jpeg" class="thread-tile__image"/>
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

    const { push: routerPush} = useRouter();

    const shownThreads = reactive([]);
    const newThreadsToLoad = reactive([]);

    const maxId = ref<number | null>(null);

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


    @media (max-width: 800px) {

        .container{
            width:100%;
        }

        .threads{
            justify-content:center;
        }

    }

</style>