<template>
    <div class="thread">
        <header class="thread__header">
            <button @click="routerPush('/user/profile/' + thread.author_username)" class="thread__author">
                <i class="user-icon fa fa-user"></i>
                <span>u/{{ thread.author_username }}</span>
                <strong v-if="getIsLoggedIn && (thread.author_user_id === getUserData.user_id)" class="you">(You)</strong>
            </button>
            <div class="header-controls">
                <button v-if="isThreadRemoveButtonShown" class="header-controls__button" title="Remove Thread">
                    <i class="fa fa-close"></i>
                </button>
                <button v-if="isThreadHideButtonShown" class="header-controls__button" title="Hide Thread">
                    <i class="fa fa-eye-slash"></i>
                </button>
                <button v-if="isThreadReportButtonShown" class="header-controls__button" title="Report Thread" @click="reportThread">
                    <i class="fa fa-flag"></i>
                </button>
            </div>
        </header>
        <section class="thread__body">
            <h2 class="thread__headline">{{ thread.headline }}</h2>
            <div class="thread__content" v-html="thread.content"></div>
        </section>
    </div>
</template>

<script lang="ts" setup>
    import { useRouter } from 'vue-router';
    import { computed } from 'vue';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { CoreRole, ModeratorRole, ThreadStatus } from '@/types';
    import type { PropType } from 'vue';
    import type { ThreadData } from '@/types';

    const props = defineProps({
        thread: {
            type: Object as PropType<ThreadData>, 
            required: true
        }
    });

    const emit = defineEmits(['reportThread']);

    const { push: routerPush } = useRouter();
    const { getIsLoggedIn, getUserData } = useAuthStore();

    const isThreadRemoveButtonShown = computed(() => {

        if(!getIsLoggedIn.value){
            return false;
        }else if([CoreRole.ADMINISTRATOR, CoreRole.SUPER_ADMINISTRATOR].includes(props.thread.author_core_role!)){
            return false;
        }else if(props.thread.author_core_role === CoreRole.STAFF && getUserData.core_role === CoreRole.STAFF){
            return false;
        }else if(getUserData.core_role === CoreRole.REGULAR_USER){
            return false;
        }

        return true;
    });

    const isThreadHideButtonShown = computed(() => {

        if(!getIsLoggedIn.value){
            return false;
        }else if(props.thread.author_core_role !== CoreRole.REGULAR_USER){
            return false;
        }else if(getUserData.core_role !== CoreRole.REGULAR_USER){
            return false;
        }else if(![ModeratorRole.SILVER_MODERATOR, ModeratorRole.PLATIMUM_MODERATOR].includes(getUserData.moderator_role as ModeratorRole)){
            return false;
        }

        return true;

    });

    const isThreadReportButtonShown = computed(() => {

        if(getIsLoggedIn.value === true && getUserData.core_role !== CoreRole.REGULAR_USER){
            return false;
        }else if(getIsLoggedIn.value == true && (getUserData.user_id === +props.thread.author_user_id!)){
            return false;
        }

        return true;
    });

    const reportThread = () => {
        emit('reportThread', {
            entityType: 'thread',
            entityId: props.thread.id
        });
    }

</script>

<style lang="scss" scoped>
 .thread {
        border:1px solid #ccc;
        border-radius:.5rem;
        overflow:hidden;
        margin:1rem 0;

        &__header{
            background:#33ab87;
            padding:1rem;
            font-size:1.4rem;
            display:flex;
            justify-content:space-between;
            align-items:center;
        }

        &__author{
            background:transparent;
            border:none;
            color:#fff;
        }

        &__body{
            min-height:20rem;
            background:#fff;
            padding:1rem;
        }

        &__headline{
            font-size:1.8rem;
            color:#2C414F;
            border-bottom:1px solid #ccc;
        }

        &__content{
            font-size:1.4rem;
            margin-top:1rem;
        }

        &__footer{
            background:#fff;
            border-top:1px solid #ccc;
        }

        .user-icon{
            margin-right:.5rem;
        }

        .header-controls{
            &__button{
                background:transparent;
                color:#fff;
                border:none;

                &:not(:last-child){
                    margin-right:.75rem;
                }
            }
        }
    }
</style>