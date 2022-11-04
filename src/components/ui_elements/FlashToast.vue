<template>
    <div 
    v-if="isOpen"
    class="flash-toast"
    :class="{'red': messageType === 'ERROR', 'green': messageType === 'SUCCESS'}"
    >
        <i v-if="messageType === 'ERROR'" class="fa fa-times"></i>
        <i v-else-if="messageType === 'SUCCESS'" class="fa fa-check"></i>
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
                return ['SUCCESS','ERROR'].includes(value);
            }
        }, 
        messageText: {
            type: String, 
            required: true
        }
    });

    const emit = defineEmits(['closeFlash']);

    watch(() => props.isOpen, (val) => {
        if(val === true){
            setTimeout(() => {
                emit('closeFlash');
            }, 3000);
        }
    })


</script>