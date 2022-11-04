<template>
    <div class="profile">
        <div class="container">
            <template v-if="isProfileLoading">
                <div class="loading-spinner-container">
                    <img class="loading-spinner" src="@/assets/ring-spinner.svg" alt="Loading..."/>
                </div>
            </template>
            <template v-else-if="!isProfileLoading && isProfileNotFound">
                <div class="not-found">
                    <div class="not-found__content">
                        <i class="fa fa-times"></i>
                        <p class="not-found__super-text">Aww Snap!</p>
                        <p class="not-found__text">Profile Not Found</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="profile-banner">
                    <div class="profile-banner__img"></div>
                    <h1 class="profile-banner__username">{{ username }}</h1>
                </div>
                <div class="profile-grid">
                    <div class="control-pane">
                        <template v-if="isPersonalBtnsShown">
                            <button class="control-pane__btn">
                                <i class="fa fa-edit"></i>
                                <span>Edit Profile</span>
                            </button>
                            <button class="control-pane__btn">
                                <i class="fa fa-cogs"></i>
                                <span>Account Settings</span>
                            </button>
                        </template>
                        <template v-else>
                            <button class="control-pane__btn">
                                <span>Block User</span>
                            </button>
                            <button class="control-pane__btn">
                                <span>Follow User</span>
                            </button>
                            <button class="control-pane__btn">
                                <span>Report User</span>
                            </button>
                        </template>
                    </div>
                    <div class="main-area">

                    </div>
                </div>
            </template>
        </div>
    </div>
</template>


<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { useAuthStore } from '@/stores/useAuthStore';

    const { params: routeParams } = useRoute();
    const { getUserData, getIsLoggedIn } = useAuthStore();

    const isProfileLoading = ref<boolean>(true);
    const isProfileNotFound = ref<boolean>(false);

    const username = computed(() => routeParams.username );

    const isPersonalBtnsShown = computed(() => {
        return getIsLoggedIn.value && username.value === getUserData.username;
    });

</script>


<style lang="scss" scoped>

    .container{
        width:75%;
        margin: 2rem auto;
    }

    .profile-banner{

        height:12rem;
        background:linear-gradient(to bottom right, #11998e, #38ef7d);
        border-radius:.5rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);
        position:relative;

        &__img{
            width:14rem;
            height:14rem;
            border-radius:90%;
            border:2px solid #eee;
            background:#fff;
            position:absolute;
            bottom:-7rem;
            left:3rem;
            object-fit:cover;
            object-position:center;
        }

        &__username{
            font-size:2rem;
            color:#fff;
            position:absolute;
            bottom:1rem;
            left:20rem;
            text-shadow:1px 1px 1px rgba(0,0,0,.24);
        }

    }

    .profile-grid {
        display:grid;
        grid-template-columns:30rem auto;
        grid-gap:2rem;
    }

    .control-pane{
        background:#fff;
        padding:1rem;
        margin-top:10rem;
        border-radius:.5rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);

        &__btn{
            display:block;
            padding:1rem;
            background:#eee;
            border:1px solid #aaa;
            width:100%;
            border-radius:.5rem;

            i {
                margin-right:.5rem;
            }

            &:not(:last-child){
                margin-bottom:1rem;
            }
        }

    }

    .loading-spinner-container{
        display:flex;
        height:70vh;
        align-items:center;
        justify-content:center;
    }

    .loading-spinner{
        display:block;
    }

    .not-found{
        height:70vh;
        display:flex;
        justify-content:center;
        align-items:center;

        &__content{
            color:#aaa;
            text-align:center;

            i{
                font-size:10rem;
            }

        }

        &__super-text{
            font-size:2rem;
        }

        &__text{
            font-size:4rem;
        }
    }


    @media (max-width:700px) {

        .profile{
            padding:0 1rem;
        }

        .container {
            width:100%;
        }

    }

</style>