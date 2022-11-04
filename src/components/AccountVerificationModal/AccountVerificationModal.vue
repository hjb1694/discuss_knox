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
                    <text-input type="text" label="Email Verification Code"/>
                </div>
            </section>
            <footer class="account-verification-modal__footer">
                <button class="send-new-code-btn">Send A New Verification Code</button>
                <button class="verify-btn">Verify</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import textInput from '@/components/ui_elements/TextInput.vue';
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        isOpen: {
            type: Boolean, 
            default: false
        }
    });

    const emit = defineEmits(['closeModal']);

    const closeModal = () => {
        emit('closeModal');
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