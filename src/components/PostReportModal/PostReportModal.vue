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
                <h3>Reason(s)</h3>
                <form @submit.prevent>
                    <div class="fgrp">
                        <checkbox-input input-id="duplicate" v-model="isDuplicatePostChecked" label="Duplicate Post"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="offensive" v-model="isOffensiveChecked" label="Offensive"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="explicit" v-model="isExplicitChecked" label="Too Explicit"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="nonsense" v-model="isNonsenseChecked" label="Nonsense"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="illegal" v-model="isIllegalChecked" label="Promoting Illegal or Injurious Activity"/>
                    </div>
                    <div class="fgrp">
                        <checkbox-input input-id="other" v-model="isOtherChecked" label="Other"/>
                    </div>
                </form>
                <div v-if="reportSubmissionErrors.length" class="errbox">
                    <p v-for="error in reportSubmissionErrors" :key="error">{{ error }}</p>
                </div>
            </section>
            <footer class="post-report-modal__footer">
               <button class="btn" @click="submitReport" :disabled="isReportSubmissionProcessing">
                    <span v-if="!isReportSubmissionProcessing">Submit Report</span>
                    <span v-else>Processing...</span>
               </button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import CheckboxInput from '@/components/ui_elements/CheckboxInput.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';

const { getAuthToken, logout } = useAuthStore();
const { openFlashToast } = useFlashToastStore();

const isDuplicatePostChecked = ref<boolean>(false);
const isOffensiveChecked = ref<boolean>(false);
const isExplicitChecked = ref<boolean>(false);
const isNonsenseChecked = ref<boolean>(false);
const isIllegalChecked = ref<boolean>(false);
const isOtherChecked = ref<boolean>(false);

const reportSubmissionErrors = reactive<string[]>([]);
const isReportSubmissionProcessing = ref<boolean>(false);

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

    reportSubmissionErrors.splice(0,reportSubmissionErrors.length);
    let isValid = true;

    if(![
        isDuplicatePostChecked.value, 
        isOffensiveChecked.value, 
        isExplicitChecked.value, 
        isNonsenseChecked.value, 
        isIllegalChecked.value, 
        isOtherChecked.value
    ].includes(true)){
        isValid = false;
        reportSubmissionErrors.push('Must select at least 1 reason.');
    }

    return isValid;

}

const submitReport = async () => {

    if(!validation()){
        return;
    }

    isReportSubmissionProcessing.value = true;

    try{

        await axios.post('http://155.138.197.17:8080/api/v1/report-post', {
            entity_type: props.entityType, 
            entity_id: props.entityId,
            is_duplicate: isDuplicatePostChecked.value,
            is_offensive: isOffensiveChecked.value, 
            is_nonsense: isNonsenseChecked.value,
            is_explicit: isExplicitChecked.value, 
            is_illegal: isIllegalChecked.value, 
            is_other: isOtherChecked.value
        }, 
        {
            headers: {
                'x-auth-token': getAuthToken.value
            }
        });

        openFlashToast(MessageTypes.SUCCESS, 'Posting successfully reported.');
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
            }else if(shortMsg === 'ERR_ALREADY_REPORTED'){
                reportSubmissionErrors.push('You have already reported this posting.');
            }else{
                reportSubmissionErrors.push('An unexpected error has occurred.');
            }

        }else{
            reportSubmissionErrors.push('An unexpected error has occurred.');
        }


    }finally{
        isReportSubmissionProcessing.value = false;
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