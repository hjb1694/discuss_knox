<template>
    <div class="processing-overlay">
        <img src="@/assets/ring-spinner.svg" class="spinner" />
    </div>
</template>

<style lang="scss" scoped>
    .processing-overlay{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:#fff;
        z-index:10000;
        display:flex;
        align-items:center;
        justify-content:center;
    }

    .spinner{
        width:20rem;
    }
</style>