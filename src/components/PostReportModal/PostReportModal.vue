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
            </section>
            <footer class="post-report-modal__footer">
               <button class="btn">Submit Report</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CheckboxInput from '@/components/ui_elements/CheckboxInput.vue';

const isDuplicatePostChecked = ref<boolean>(false);
const isOffensiveChecked = ref<boolean>(false);
const isExplicitChecked = ref<boolean>(false);
const isNonsenseChecked = ref<boolean>(false);
const isIllegalChecked = ref<boolean>(false);
const isOtherChecked = ref<boolean>(false);

const emit = defineEmits(['closeModal']);

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
    }

    .fgrp{
        margin:1rem 0;
    }

</style>