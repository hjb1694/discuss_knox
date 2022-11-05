<template>
    <div class="private-message-modal">
        <div class="private-message-modal__backdrop"></div>
        <div class="private-message-modal__dialog">
            <header class="private-message-modal__header">
                <h2>Chat with {{ chatWithUsername }}</h2>
                <button class="private-message-modal__close-btn">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="private-message-modal__body">
                <div class="messages-area">


                </div>
                <textarea class="textarea" placeholder="Your Message Here"></textarea>
            </section>
            <footer class="private-message-modal__footer">
                <button class="send-btn">Send</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        chatWithUsername: {
            type: String, 
            required: true
        }
    });

</script>

<style lang="scss" scoped>

    .private-message-modal{
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
        }

        &__close-btn{
            color:#aaa;
            font-size:3rem;
            background:transparent;
            border:none;
        }

        &__body{
            padding:1rem;

            .messages-area{
                height:30rem;
                background:#fafafa;
                border:1px solid #ccc;
                overflow-y:auto;
            }

            .textarea{
                resize:none;
                border:1px solid #ccc;
                width:100%;
                padding:3px;
            }
        }

         &__footer{
            padding:1rem;
            border-top:1px solid #eee;
            display:flex;
            justify-content:flex-end;
        }

        .send-btn{
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

</style>