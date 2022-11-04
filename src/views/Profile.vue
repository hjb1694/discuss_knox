<template>
    <div class="profile">
        <div class="container">
            <div class="profile-banner">
                <div class="profile-banner__img"></div>
                <h1 class="profile-banner__username">{{ username }}</h1>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    const { params: routeParams } = useRoute();

    const username = computed(() => routeParams.username );

</script>


<style lang="scss" scoped>

    .container{
        width:75%;
        margin: 2rem auto;
    }

    .profile-banner{

        height:12rem;
        background:linear-gradient(to bottom right, #11998e, #38ef7d);
        border-radius:.5rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        position:relative;

        &__img{
            width:14rem;
            height:14rem;
            border-radius:90%;
            border:2px solid #eee;
            background:#fff;
            position:absolute;
            bottom:-7rem;
            left:3rem;
            object-fit:cover;
            object-position:center;
        }

        &__username{
            font-size:2rem;
            color:#fff;
            position:absolute;
            bottom:1rem;
            left:20rem;
            text-shadow:1px 1px 1px rgba(0,0,0,.24);
        }

    }


    @media (max-width:700px) {

        .profile{
            padding:0 1rem;
        }

        .container {
            width:100%;
        }

    }

</style>