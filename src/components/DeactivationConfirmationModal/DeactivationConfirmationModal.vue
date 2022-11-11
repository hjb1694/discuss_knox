<template>
    <div v-if="isOpen" class="deactivation-confirmation-modal">
        <div class="deactivation-confirmation-modal__backdrop" @click="$emit('selection', false)"></div>
        <div class="deactivation-confirmation-modal__dialog">
            <header class="deactivation-confirmation-modal__header">
                <h2>Are you sure?</h2>
                <button class="deactivation-confirmation-modal__close-btn" @click="$emit('selection', false)">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="deactivation-confirmation-modal__body">
                <p>This is a permenant action and cannot be undone.</p>
            </section>
            <footer class="deactivation-confirmation-modal__footer">
                <button class="btn" @click="$emit('selection', true)">Yes</button>
                <button class="btn" @click="$emit('selection', false)">No</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>

    const props = defineProps({
        isOpen: {
            type: Boolean, 
            default: false
        }
    });

    const emits = defineEmits(['selection']);

</script>

<style lang="scss" scoped>
    .deactivation-confirmation-modal{
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

            p{
                font-size:1.4rem;
            }
        }

        &__footer{
            padding:1rem;
            border-top:1px solid #eee;
            display:flex;
            justify-content:flex-end;

            .btn{
                display:block;
                background:#21bf8f;
                border:none;
                padding:.8rem 1.2rem;
                color:#fff;
                font-size:1.6rem;
                font-weight:bold;
                border-radius:.5rem;

                &:not(:last-child){
                    margin-right:2rem;
                }
            }
        }
    }

</style>