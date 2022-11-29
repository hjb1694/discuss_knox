<template>
    <div class="accordion">
        <header class="accordion__header" @click="toggleAccordion">
            {{ headerContent }}
        </header>
        <section v-if="isOpen" class="accordion__body">
            <slot name="accordioncontent">
                [Content Here]
            </slot>
        </section>
    </div>
</template>

<script lang="ts" setup>

    import { ref } from 'vue';

    const props = defineProps({
        headerContent: {
            type: String, 
            default: '[Header Content]'
        }
    });

    const isOpen = ref<boolean>(false);

    const toggleAccordion = () => {
        isOpen.value = !isOpen.value;
    }

</script>

<style lang="scss" scoped>

    .accordion{
        background:#fff;
        border:1px solid #ccc;

        &__header{
            padding:1rem;
            font-size:1.6rem;
            color:#888;
            cursor:pointer;
            user-select:none;
            font-weight: bold;
        }

        &__body{
            padding:1rem;
            font-size:1.4rem;
            color:#333;
            border-top:1px solid #ccc;
        }
    }

</style>