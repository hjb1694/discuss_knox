<template>
    <div class="error-display">
        <i class="big-error-icon fa fa-close"></i>
        <h2 class="error-heading">Aww Snap!</h2>
        <p class="error-text">{{ message }}</p>
    </div>
</template>

<script lang="ts" setup>

    const props = defineProps({
        message: {
            type: String, 
            default: 'An error has occurred.'
        }
    });

</script>

<style lang="scss" scoped>
    .error-display{
        height:70vh;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction:column;
        color:#888;

        .big-error-icon{
            font-size:6rem;
        }

        .error-heading{
            font-size:3rem;
        }

        .error-text{
            font-size:1.8rem;
        }


    }

</style>