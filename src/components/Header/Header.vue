<template>
    <div>
        <div class="top-banner">
            <p>A Ktown Portal Official Website</p>
        </div>
        <header class="primary-header">
            <div class="container">
                <img class="primary-header__logo" src="@/assets/knox_discuss_logo.png"/>
                <button v-if="!getIsLoggedIn" class="auth-btn" @click="openAuthModal">
                    <div class="auth-btn__icon-container">
                        <i class="auth-btn__icon fa fa-user"></i>
                    </div>
                </button>
                <div v-else class="user-dropdown">
                    <button class="user-dropdown__toggle" @click="isUserPaneShown = !isUserPaneShown">
                        {{ getUserData.username.substring(0,1) }}
                    </button>
                    <div class="user-dropdown__pane" v-show="isUserPaneShown">
                        <div class="user-dropdown__item">
                            <i class="fa fa-user"></i>
                            <p>{{ getUserData.username }}</p>
                        </div>
                        <div class="user-dropdown__item">
                            Profile
                        </div>
                        <div class="user-dropdown__item">
                            Notifications
                        </div>
                        <div class="user-dropdown__item">
                            Messages
                        </div>
                        <div class="user-dropdown__item">
                            Settings
                        </div>
                        <div class="user-dropdown__item">
                            Logout
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <div class="secondary-header">
            <div class="container">
                <button>Add Post</button>
                <button>Live Feed</button>
                <button>Channels</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { ref } from 'vue';

    const { openAuthModal } = useCoreModalStore();
    const { getIsLoggedIn, getUserData } = useAuthStore();

    const isUserPaneShown = ref<boolean>(false);


</script>

<style lang="scss" scoped>
    .top-banner{
        background:#333;
        height:3rem;
        display:flex;
        justify-content:center;
        align-items:center;
        color:#fff;
        font-size:1.4rem;
    }

    .container{
        max-width:75%;
        margin:0 auto;
    }

    .primary-header {
        border-bottom:1px solid #eee;
        background:#fff;
        padding:1.5rem;
        height:8rem;

        &__logo{
            display:block;
            width:25rem;
        }
    }

    .secondary-header{
        padding:0 1rem;
    }

    .primary-header .container{
        display:flex;
        align-items: center;
        justify-content: space-between;
    }

    .secondary-header .container{
        height:100%;
        display:flex;
        align-items:center;
    }

    .auth-btn{

        display:flex;
        align-items:center;
        background:transparent;
        border:none;

        &__icon-container{
            width:4rem;
            height:4rem;
            border-radius:90%;
            box-shadow:0 0 .5rem rgba(0,0,0,.24);
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:1rem;
            background:#21bf8f;
            color:#fff;
        }
    }

    .secondary-header{
        background:linear-gradient(to bottom, #21bf8f 50%, #33ab87 50%);
        height:4rem;

        button{
            background:transparent;
            border:none;
            color:#fff;
            font-weight:bold;
            font-size:1.6rem;
            text-shadow:1px 1px 1px rgba(0,0,0,.24);

            &:not(:last-child){
                margin-right:2rem;
            }
        }
    }

    .user-dropdown{

        position:relative;

        &__toggle{
            width:4rem;
            height:4rem;
            border-radius:90%;
            display:flex;
            justify-content:center;
            align-items:center;
            border:1px solid #ccc;
        }

        &__pane{
            position:absolute;
            top:5rem;
            right:0;
            background:#fff;
            box-shadow:0 0 .5rem rgba(0,0,0,.24);
            min-width:15rem;
        }

        &__item{
            display:flex;
            align-items:center;
            font-size:1.4rem;
            padding:1rem;
            transition:background .3s;
            cursor:pointer;

            i{
                margin-right:1rem;
            }

            &:hover{
                background:#fafafa;
            }
        }


    }


    @media (max-width:700px) {

        .container{
            max-width:100%;
        }

        .primary-header__logo{
            width:20rem;
        }


    }
</style>