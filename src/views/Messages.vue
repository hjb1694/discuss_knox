<template>
    <div class="container">
        Messages
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useMessagesStore } from '@/stores/useMessagesStore';

const { fetchLatestMessages, getLatestMessages } = useMessagesStore();

onMounted(() => {

    fetchLatestMessages();

    console.log(getLatestMessages);

});


</script>

<style lang="scss" scoped>
    .container{
        width:75%;
        margin: 2rem auto;
    }
</style>