<template>
    <div v-if="isOpen" class="account-verification-modal">
        <div class="account-verification-modal__backdrop" @click="closeModal"></div>
        <div class="account-verification-modal__dialog">
            <header class="account-verification-modal__header">
                <button class="account-verification-modal__close-btn" @click="closeModal">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="account-verification-modal__body">
                <h2 class="heading">Welcome to Ktown Portal!</h2>
                <p class="text">
                    Please check your email inbox for a verification code. Please enter the verification 
                    code below to unlock the many features Ktown Portal has to offer.
                </p>
                <div class="fgrp">
                    <text-input v-model="vericodeInput" type="text" label="Email Verification Code" :disabled="vericodeProcessing"/>
                </div>
                <div v-if="vericodeErrors.length" class="errbox">
                    <p v-for="error in vericodeErrors" :key="error">{{ error }}</p>
                </div>
            </section>
            <footer class="account-verification-modal__footer">
                <button class="send-new-code-btn">Send A New Verification Code</button>
                <button class="verify-btn" @click="verify">
                    <span v-if="!vericodeProcessing">Verify</span>
                    <span v-else>Processing...</span>
                </button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import textInput from '@/components/ui_elements/TextInput.vue';
    import { defineProps, defineEmits, ref, reactive } from 'vue';
    import stringLength from 'string-length';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import axios from 'axios';

    const props = defineProps({
        isOpen: {
            type: Boolean, 
            default: false
        }
    });

    const emit = defineEmits(['closeModal']);

    const { getAuthToken, setAccountStatus } = useAuthStore();
    const { closeEmailVerifyModal } = useCoreModalStore();

    const vericodeInput = ref<string>('');
    const vericodeErrors = reactive<string[]>([]);
    const vericodeProcessing = ref<boolean>(false);

    const closeModal = () => {
        emit('closeModal');
    }

    const validation = () => {
        vericodeErrors.splice(0,vericodeErrors.length);

        if(stringLength(vericodeInput.value) < 1){
            vericodeErrors.push('Please enter a valid verification code.');
            return false;
        }

        return true;
    }

    const verify = async () => {
        if(!validation()){
            return;
        }

        try{
            vericodeProcessing.value = true;

            await axios.post('http://66.42.81.246:8080/api/v1/verify-account', {
                vericode: vericodeInput.value
            }, {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            vericodeInput.value = '';

            setAccountStatus('ACTIVE');

            closeEmailVerifyModal();

        }catch(e){
            console.error(e);


        }finally{
            vericodeProcessing.value = false;
        }

    }
</script>

<style lang="scss" scoped>

    .account-verification-modal{
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
            justify-content:flex-end;
            padding:1rem;
            border-bottom:1px solid #eee;
        }

        &__close-btn{
            color:#aaa;
            font-size:3rem;
            background:transparent;
            border:none;
        }

        &__body{
            padding:1rem;
        }

        .heading{
            font-size:1.8rem;
        }

        .text{
            font-size:1.4rem;
            margin:1rem 0;
        }

        .fgrp{
            margin:1rem 0;
        }

        &__footer{
            padding:1rem;
            border-top:1px solid #eee;
            display:flex;
            justify-content:space-between;
        }

        .send-new-code-btn{
            background:transparent;
            border:none;
            color:#888;
        }

        .verify-btn{
            display:block;
            background:#21bf8f;
            border:none;
            padding:.8rem 1.2rem;
            color:#fff;
            font-size:1.6rem;
            font-weight:bold;
            border-radius:.5rem;
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

    @keyframes fade-in-down {
        from{
            transform:translateY(-2rem);
            opacity:0;
        }
        to{
            transform:translateY(0);
            opacity:1;
        }
    }

</style>