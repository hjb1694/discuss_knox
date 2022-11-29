<template>
    <div class="post-report-modal">
        <div class="post-report-modal__backdrop" @click="closeModal"></div>
        <div class="post-report-modal__dialog">
            <header class="post-report-modal__header">
                <h2 class="heading-text">Report Posting</h2>
                <button class="post-report-modal__close-btn" @click="closeModal">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="post-report-modal__body">
                <h3>Please provide a brief explanation</h3>
                <form @submit.prevent>
                    <textarea v-model="explanationInput" class="textarea"></textarea>
                </form>
                <div v-if="hideSubmissionErrors.length" class="errbox">
                    <p v-for="error in hideSubmissionErrors" :key="error">{{ error }}</p>
                </div>
            </section>
            <footer class="post-report-modal__footer">
               <button class="btn" @click="submitReport" :disabled="isHideSubmissionProcessing">
                    <span v-if="!isHideSubmissionProcessing">Hide Post</span>
                    <span v-else>Processing...</span>
               </button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
import stringLength from 'string-length';

const { getAuthToken, logout } = useAuthStore();
const { openFlashToast } = useFlashToastStore();

const hideSubmissionErrors = reactive<string[]>([]);
const isHideSubmissionProcessing = ref<boolean>(false);

const explanationInput = ref<string>('');

const props = defineProps({
    entityType: {
        type: String, 
        required: true
    }, 
    entityId: {
        type: Number, 
        required: true
    }
});

const emit = defineEmits(['closeModal']);

const validation = () => {

    hideSubmissionErrors.splice(0,hideSubmissionErrors.length);
    let isValid = true;

    if(stringLength(explanationInput.value) < 20){
        isValid = false;
        hideSubmissionErrors.push('Explanation too short.');
    }

    return isValid;

}

const submitReport = async () => {

    if(!validation()){
        return;
    }

    isHideSubmissionProcessing.value = true;

    try{

        await axios.patch('https://www.ktpdiscussapi.com/api/v1/hide-post', {
            entity_type: props.entityType, 
            entity_id: props.entityId,
            explanation: explanationInput.value.trim()
        }, 
        {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        openFlashToast(MessageTypes.SUCCESS, 'Posting successfully hidden.');
        emit('closeModal');

    }catch(e: any){

        console.error(e);

        if(e.response?.data?.short_msg){

            const shortMsg = e.response.data.short_msg;

            if(shortMsg === 'ERR_DEACTIVATED'){
                openFlashToast(MessageTypes.ERROR, 'You have been deactivated.');
                logout();
                emit('closeModal');
            }else if(shortMsg === 'ERR_FROZEN'){
                openFlashToast(MessageTypes.ERROR, 'Your account is frozen and under review by admins.');
                emit('closeModal');
            }else{
                hideSubmissionErrors.push('An unexpected error has occurred.');
            }

        }else{
            hideSubmissionErrors.push('An unexpected error has occurred.');
        }


    }finally{
        isHideSubmissionProcessing.value = false;
    }

}

const closeModal = () => {
    emit('closeModal');
}

</script>

<style lang="scss" scoped>

    .post-report-modal{
        position:fixed;
        left:0;
        top:0;
        height:100%;
        width:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:2rem;
        z-index:999;

         &__backdrop{
            position:fixed;
            left:0;
            top:0;
            height:100%;
            width:100%;
            background:rgba(0,0,0,.7);
            z-index:1000;
        }

        &__dialog{
            position:relative;
            background:#fff;
            border-radius:5px;
            box-shadow:0 0 1rem rgba(0,0,0,.4);
            z-index:1001;
            width:50rem;
            animation: fade-in-down 1s both;
        }

         &__header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:1rem;
            border-bottom:1px solid #eee;

            .heading-text{
                font-size:1.8rem;
            }
        }

        &__close-btn{
            color:#aaa;
            font-size:3rem;
            background:transparent;
            border:none;
        }

        &__body{
            padding:1rem;

            h3{
                font-size:1.6rem;
            }
        }

        &__footer{
            padding:1rem;
            border-top:1px solid #eee;
            display:flex;
            justify-content:flex-end;
        }

        .textarea{
            display:block;
            width:100%;
            height:15rem;
            border:1px solid #ccc;
            resize: none;
            padding:3px;
        }

        .btn{
            display:block;
            background:#21bf8f;
            border:none;
            padding:.8rem 1.2rem;
            color:#fff;
            font-size:1.6rem;
            font-weight:bold;
            border-radius:.5rem;
        }

        .fgrp{
            margin:1rem 0;
        }

        .errbox{
            color:#f00;
            margin-top:2rem;
            font-size:1.4rem;
            background:#ffe0de;
            border:1px solid #f00;
            padding:1rem;
            border-radius:.5rem;
        }
    }

</style>