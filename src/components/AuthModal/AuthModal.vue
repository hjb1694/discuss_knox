<template>
    <div class="auth-modal">
        <div class="auth-modal__backdrop"></div>
        <div class="auth-modal__dialog">
            <header class="auth-modal__header">
                <div class="auth-modal__toggle-btns">
                    <button>Register</button>
                    <button>Login</button>
                </div>
                <button class="auth-modal__close-btn">&times;</button>
            </header>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>


<style lang="scss" scoped>
    .auth-modal{
        position:fixed;
        left:0;
        top:0;
        height:100%;
        width:100%;
        display:flex;
        align-items:center;
        justify-content:center;

        &__backdrop{
            position:fixed;
            left:0;
            top:0;
            height:100%;
            width:100%;
            background:rgba(0,0,0,.4);
            z-index:1000;
        }

        &__dialog{
            position:relative;
            background:#fff;
            border-radius:5px;
            box-shadow:0 0 1rem rgba(0,0,0,.7);
        }

        &__header{
            display:flex;
            align-items:center;
            justify-content:space-between;
        }


    }
</style>