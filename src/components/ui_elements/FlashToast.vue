<template>
    <div 
    v-if="isOpen"
    class="flash-toast"
    :class="{'red': messageType === 'ERROR', 'green': messageType === 'SUCCESS'}"
    >
        <i v-if="messageType === 'ERROR'" class="flash-toast__icon fa fa-times"></i>
        <i v-else-if="messageType === 'SUCCESS'" class="flash-toast__icon fa fa-check"></i>
        <span class="flash-toast__text">{{ messageText }}</span>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps, watch, defineEmits } from 'vue';

    const props = defineProps({
        isOpen: {
            type: Boolean, 
            default: false
        },
        messageType: {
            type: String, 
            required: true, 
            validator(value){
                return ['SUCCESS','ERROR', ''].includes(value);
            }
        }, 
        messageText: {
            type: String, 
            required: true
        }
    });

    const emit = defineEmits(['closeToast']);

    watch(() => props.isOpen, (val) => {
        if(val === true){
            setTimeout(() => {
                emit('closeToast');
            }, 3000);
        }
    })


</script>


<style lang="scss" scoped>

    .flash-toast {

        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:6rem;
        z-index:2000;
        color:#fff;
        display:flex;
        align-items:center;
        justify-content:center;
        animation:fade-in .3s forwards;

        &.red {
            background:#f00;
        }

        &.green {
            background:green;
        }

        &__icon{
            font-size:3.5rem;
            margin-right:1.5rem;
        }

        &__text{
            font-size:1.6rem;
        }


    }


    @keyframes fade-in {
        from{opacity:0;}
        to{opacity:1;}
    }
</style>