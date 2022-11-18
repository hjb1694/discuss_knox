<template>
    <div class="container">
        <div class="threads">
            
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from 'vue';
    import axios from 'axios';

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


    @media (max-width: 800px) {

        .container{
            width:100%;
        }

    }

</style>