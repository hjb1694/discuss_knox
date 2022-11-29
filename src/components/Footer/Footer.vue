<template>
    <footer class="footer">
        <small>&copy;2022 Ktown Portal and Knox Discuss</small>
        <div class="footer-links">
            <a class="footer-links__link" @click="goTo('/help-center')">Get Help</a>
            <a class="footer-links__link" @click="goTo('/ad-opportunities')">Ad Opportunities</a>
            <a class="footer-links__link" @click="goTo('/rules-and-regulations')">Platform Rules</a>
            <a class="footer-links__link">Terms of Service</a>
            <a class="footer-links__link">Privacy Policy</a>
            <a class="footer-links__link">Core Values</a>
        </div>
    </footer>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';

    const { push: routerPush } = useRouter();

    const goTo = (path: string) => {
        routerPush(path);
    }
</script>

<style lang="scss" scoped>
    .footer{
        background:#33ab87;
        padding:1rem;
        min-height:10vh;
    }

    small{
        display:block;
        text-align: center;
    }

    .footer-links{
        max-width:30rem;
        display:grid;
        grid-template-columns: repeat(2, 1fr);
        margin:1rem auto;
        row-gap:1rem;

        &__link{
            display:block;
            text-align: center;
            font-size:1.2rem;
            color:#fff;
        }
    }
</style>