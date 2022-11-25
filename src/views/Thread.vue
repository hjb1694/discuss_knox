<template>
    <div class="container">
        <post-report-modal v-if="isPostReportModalShown" @close-modal="isPostReportModalShown = false" />
        <div v-if="isThreadLoading" class="spinner-container">
            <img class="spinner" src="@/assets/ring-spinner.svg" />
        </div>
        <app-big-error-display v-else-if="isThreadNotFound" message="This thread cannot be found."/>
        <app-big-error-display v-else-if="isErrorLoadingThread" message="There was an error loading this page."/>
        <template v-else>
            <app-main-thread-post :thread="threadData"/>
            <form class="opinion-form" v-if="isResponseFormShown" @submit.prevent>
                <h2>Add an Opinion</h2>
                <quill-editor 
                theme="snow"
                :toolbar="toolbar"
                placeholder="Write something interesting..."
                content-type="html"
                v-model:content="opinionInput"
                />
                <button @click="submitOpinion" class="btn" :disabled="isOpinionSubmissionProcessing">
                    <span v-if="!isOpinionSubmissionProcessing">Submit</span>
                    <span v-else>Processing...</span>
                </button>
                <div v-if="opinionSubmitErrors.length" class="errbox">
                    <p v-for="error in opinionSubmitErrors" :key="error">{{ error }}</p>
                </div>
            </form>
            <div class="auth-prompt" v-if="isAuthPromptShown">
                <p><a @click="openAuthModal">Login or Register</a> to add your opinion.</p>
            </div>
            <div v-if="isClosedPromptShown" class="closed-prompt">
                <p>This thread is closed.</p>
            </div>
            <div class="opinions">
                <h2>Opinions ({{ authUserOpinion.exists ? opinions.length + 1 : opinions.length }})</h2>
                <div v-if="isOpinionsLoading" class="opinions-loading-container">
                    <img src="@/assets/ring-spinner.svg" class="opinions-loading-spinner" />
                </div>
                <template v-else>
                    <template v-if="authUserOpinion.exists">
                        <h3>Your Opinion</h3>
                        <div class="opinion">
                            <header class="opinion__header">
                                <button @click="routerPush('/user/profile/' + authUserOpinion.author_username)" class="opinion__author">
                                    <i class="user-icon fa fa-user"></i>
                                    <span>u/{{ authUserOpinion.author_username }}</span>
                                </button>
                            </header>
                             <section class="opinion__body">
                                <div class="opinion__content" v-html="authUserOpinion.content"></div>
                            </section>
                            <footer class="opinion__footer">
                                <button v-if="getIsLoggedIn" @click="toggleReplyBox(authUserOpinion.id!)" class="reply-btn">
                                    <i class="reply-icon fa fa-reply"></i>
                                    <span>Reply</span>
                                </button>
                            </footer>
                        </div>
                        <div v-if="authUserOpinion.is_reply_box_shown" class="reply-box">
                            <h4>Reply</h4>
                            <textarea v-model="replyInput" class="reply-textarea"></textarea>
                            <button @click="submitReply(authUserOpinion.id!)" class="btn">Submit</button>
                            <div v-if="replySubmitErrors.length" class="errbox">
                                <p v-for="error in replySubmitErrors" :key="error">{{ error}}</p>
                            </div>
                        </div>
                        <div class="replies">
                            <div class="reply" v-for="reply in authUserOpinion.replies">
                                <header class="reply__header">
                                    <div 
                                    @click="routerPush('/user/profile/' + reply.author_username)" 
                                    class="reply__author"
                                    >
                                        <i class="user-icon fa fa-user"></i> u/{{ reply.author_username}}
                                    </div>
                                </header>
                                <section class="reply__body">
                                    <div class="reply__content">{{ reply.content }}</div>
                                </section>
                            </div>
                        </div>
                    </template>
                    <h3 v-if="authUserOpinion.exists">Other User's Opinions</h3>
                    <template v-if="opinions.length">
                        <div v-for="opinion of opinions">
                            <div class="opinion">
                                <header class="opinion__header">
                                    <button @click="routerPush('/user/profile/' + opinion.author_username)" class="opinion__author">
                                        <i class="user-icon fa fa-user"></i>
                                        <span>u/{{ opinion.author_username }}</span>
                                        <strong v-if="getIsLoggedIn && (+opinion.author_user_id! === getUserData.user_id)" class="you">(You)</strong>
                                    </button>
                                    <div class="header-controls">
                                        <button v-if="determineOpinionRemoveButtonShown(opinion.author_core_role!)" class="header-controls__button">
                                            <i class="fa fa-close"></i>
                                        </button>
                                        <button v-if="determineOpinionHideButtonShown(opinion.author_core_role!, opinion.author_moderator_role!, opinion.author_user_id!)" class="header-controls__button">
                                            <i class="fa fa-eye-slash"></i>
                                        </button>
                                        <button v-if="determineOpinionReportButtonShown(opinion.author_core_role!, opinion.author_user_id!)" class="header-controls__button">
                                            <i class="fa fa-flag"></i>
                                        </button>
                                    </div>
                                </header>
                                <section class="opinion__body">
                                    <div class="opinion__content" v-html="opinion.content"></div>
                                </section>
                                <footer class="opinion__footer">
                                    <button v-if="getIsLoggedIn" @click="toggleReplyBox(opinion.id!)" class="reply-btn">
                                        <i class="reply-icon fa fa-reply"></i>
                                        <span>Reply</span>
                                    </button>
                                </footer>
                            </div> 
                            <div v-if="opinion.is_reply_box_shown" class="reply-box">
                                <h4>Reply</h4>
                                <textarea v-model="replyInput" class="reply-textarea"></textarea>
                                <button @click="submitReply(opinion.id!)" class="btn">Submit</button>
                                <div v-if="replySubmitErrors.length" class="errbox">
                                    <p v-for="error in replySubmitErrors" :key="error">{{ error}}</p>
                                </div>
                            </div>
                            <div class="replies">
                                <div class="reply" v-for="reply in opinion.replies">
                                    <header class="reply__header">
                                        <div 
                                        @click="routerPush('/user/profile/' + reply.author_username)" 
                                        class="reply__author"
                                        >
                                            <i class="user-icon fa fa-user"></i> u/{{ reply.author_username}}
                                        </div>
                                    </header>
                                    <section class="reply__body">
                                        <div class="reply__content">{{ reply.content }}</div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="none">
                        No Opinions Just Yet :(
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted, computed, watch, onUnmounted } from 'vue';
    import axios from 'axios';
    import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
    import { QuillEditor } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import sanitizeHTML from 'sanitize-html';
    import stringLength from 'string-length';
    import { decode as htmlEntityDecode } from 'html-entities';
    import Pusher from 'pusher-js';
    import AppBigErrorDisplay from '@/components/BigErrorDisplay/BigErrorDisplay.vue';
    import { type ThreadData, type Opinion, type AuthUserOpinion, CoreRole, ModeratorRole } from '@/types';
    import AppMainThreadPost from '@/components/MainThreadPost/MainThreadPost.vue';
    import PostReportModal from '@/components/PostReportModal/PostReportModal.vue';

    interface PusherInstance {
        instance: Pusher | null;
        channel: any;
    }

    const { params: routeParams } = useRoute();
    const { push: routerPush } = useRouter();
    const { getIsLoggedIn, getUserData, getAuthToken, logout} = useAuthStore();
    const { openAuthModal, openEmailVerifyModal } = useCoreModalStore();
    const { openFlashToast } = useFlashToastStore();

    const slug = ref<any>(routeParams.slug);
    const threadData = reactive<ThreadData>({
        id: null, 
        author_user_id: null,
        author_username: null, 
        slug: null, 
        headline: null, 
        channel_id: null, 
        content: null, 
        main_image: null, 
        status: null, 
        added_ts: null, 
        author_core_role: null, 
        author_moderator_role: null
    });
    const authUserOpinion = reactive<AuthUserOpinion>({
        id: null,
        exists: false,
        author_username: null, 
        author_user_id: null, 
        content: null, 
        is_reply_box_shown: false, 
        status: null,
        replies: [], 
        added_ts: null, 
        thread_id: null,
        author_core_role: null, 
        author_moderator_role: null
    });
    const opinionSubmitErrors = reactive<string[]>([]);
    const isOpinionSubmissionProcessing = ref<boolean>(false);
    const isThreadLoading = ref<boolean>(true);
    const isOpinionsLoading = ref<boolean>(true);
    const opinions = reactive<Opinion[]>([]);
    const isThreadNotFound = ref<boolean>(false);
    const isErrorLoadingThread = ref<boolean>(false);
    const replySubmitErrors = reactive<string[]>([]);
    const isPostReportModalShown = ref<boolean>(false);

    const replyInput = ref<string>('');

    const pusher = reactive<PusherInstance>({
        instance: null, 
        channel: null
    });

    const opinionInput = ref<string>('');

    const toolbar = ['bold', 'italic', 'underline', {'list': 'ordered'}, {'list': 'bullet'}];

    const isResponseFormShown = computed(() => {
        return getIsLoggedIn.value === true && 
        threadData.author_user_id !== getUserData.user_id &&
        threadData.status !== 'CLOSED' &&
        !authUserOpinion.exists;
    });

    const isAuthPromptShown = computed(() => {
        return getIsLoggedIn.value === false &&
        threadData.status !== 'CLOSED';
    });

    const isClosedPromptShown = computed(() => {
        return threadData.status === 'CLOSED';
    });

    const listenForNewOpinions = () => {

        pusher.channel.bind('new_opinion', (data: any) => {

            if(getIsLoggedIn.value === true){

                if(+data.author_user_id === getUserData.user_id){

                    authUserOpinion.exists = true;
                    authUserOpinion.author_username = data.author_username;
                    authUserOpinion.author_user_id = data.author_user_id;
                    authUserOpinion.content = data.content;
                    authUserOpinion.id = data.id;
                    authUserOpinion.is_reply_box_shown = false;

                }else{
                    opinions.unshift({...data, is_reply_box_shown: false});
                }

            }else{

                opinions.unshift({...data, is_reply_box_shown: false});

            }


        });

    }

    const listenForNewReplies = () => {

        pusher.channel.bind('new-reply', (data: any) => {

            if(getIsLoggedIn.value){

                if(authUserOpinion.exists && +data.opinion_id === authUserOpinion.id){
                    authUserOpinion.replies.push(data);
                }else{

                    const idx = opinions.findIndex(op => op.id === +data.opinion_id)
                    opinions.push(data);

                }

            }else{

                const idx = opinions.findIndex(op => op.id === +data.opinion_id)
                opinions.push(data);

            }

        });

    }



    const createPusherInstance = () => {

        pusher.instance = new Pusher('f5ea34c17095fbb4548a');

        pusher.channel = pusher.instance.subscribe(`thread-${slug.value}`);

        listenForNewOpinions();
        listenForNewReplies();

    }

    const fetchThread = async () => {

        try{

            isThreadLoading.value = true;

            const response = await axios.get(`http://155.138.197.17:8080/api/v1/thread/${slug.value}`);

            const thread = response.data.body.thread;

            const parser = new DOMParser();

            const dom = parser.parseFromString(thread.content, 'text/html');

            const images = dom.querySelectorAll('img');

            images.forEach(image => {
                const url = new URL(image.src);

                image.style.display = 'block';
                image.style.margin = '1rem auto';
                image.style.maxWidth = '300px';
                image.src = `http://155.138.197.17:8080/thread_img/${url.pathname.split('/')[2]}`;
            });

            thread.content = dom.body.innerHTML;

            for(let key in thread){
                threadData[key]  = thread[key];
            }

            fetchOpinions();
            createPusherInstance();


        }catch(e: any){
            console.error(e);

            if(e.response?.data?.short_msg){

                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_NOT_FOUND'){
                    isThreadNotFound.value = true;
                }else{
                    isErrorLoadingThread.value = true;
                }

            }else{
                isErrorLoadingThread.value = true;
            }
        }finally{
            isThreadLoading.value = false;
        }

    }

    const stripTags = (value: string) => {
        return sanitizeHTML(value, {
            allowedTags: []
        })
    }

    const stripAllWS = (value: string) => {
        let stripped = value.replace(/ +/g,'');
        stripped = value.replace(/\n+/g,'');
        stripped = value.replace(/\s+/g,'');
        return stripped;
    }

    const opinionValidation = () => {


        opinionSubmitErrors.splice(0,opinionSubmitErrors.length);
        let isValid = true;

        if(stringLength(htmlEntityDecode(stripAllWS(stripTags(opinionInput.value)))) < 20){
            isValid = false;
            opinionSubmitErrors.push('Opinion is too short.');
        }

        if(stringLength(htmlEntityDecode(stripAllWS(stripTags(opinionInput.value)))) > 3000){
            isValid = false;
            opinionSubmitErrors.push('Opinion is too long.');
        }

        return isValid;

    }

    const submitOpinion = async () => {

        if(!opinionValidation()){
            return;
        }

        isOpinionSubmissionProcessing.value = true;

        try{

            await axios.post('http://155.138.197.17:8080/api/v1/opinions', 
            {
                thread_id: threadData.id, 
                content: opinionInput.value
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

        }catch(e: any){
            console.error(e);

            if(e.response?.data?.short_msg){
                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_DEACTIVATION'){
                    openFlashToast(MessageTypes.ERROR, 'You have been deactivated.');
                    logout();
                }else if(shortMsg === 'ERR_NOT_VERIFIED'){
                    openEmailVerifyModal();
                }else if(shortMsg === 'FROZEN'){
                    openFlashToast(MessageTypes.ERROR, 'Your account is frozen and under review by admins.');
                }else{
                    opinionSubmitErrors.push('An error has occurred.');
                }

            }else{
                opinionSubmitErrors.push('An error has occurred.');
            }
        }finally{
            isOpinionSubmissionProcessing.value = false;
        }


    }

    const fetchOpinions = async () => {

        isOpinionsLoading.value = true;
        opinions.splice(0, opinions.length);

        try{

            const response = await axios.get(`http://155.138.197.17:8080/api/v1/opinions/${threadData.id}`);

            if(getIsLoggedIn.value === true){

                const authOp = response.data.body.opinions.find((op: any) => op.author_user_id === getUserData.user_id);

                if(authOp.length){
                    authUserOpinion.exists = true;
                    authUserOpinion.author_username = authOp.author_username;
                    authUserOpinion.author_user_id = authOp.author_user_id;
                    authUserOpinion.content = authOp.content;
                    authUserOpinion.id = authOp.id;
                    authUserOpinion.replies = authOp.replies;
                    authUserOpinion.is_reply_box_shown = false;
                    authUserOpinion.author_core_role = authOp.author_core_role;
                    authUserOpinion.author_moderator_role = authOp.author_moderator_role;

                    let otherOps = response.data.body.opinions.filter((op: any) => op.author_user_id !== getUserData.user_id);
                    otherOps = otherOps.map((op: any) => ({...op, is_reply_box_shown: false}));

                    opinions.push(...otherOps);
                }else{
                    
                    let otherOps = response.data.body.opinions.map((op: any) => ({...op, is_reply_box_shown: false}));
                    opinions.push(...otherOps);

                }

            }else{

                let otherOps = response.data.body.opinions.map((op: any) => ({...op, is_reply_box_shown: false}));
                opinions.push(...otherOps);

            }

        }catch(e){
            console.error(e);
        }finally{
            isOpinionsLoading.value = false;
        }

    }

    const closeOtherReplyBoxes = (opinionId: number) => {

        replyInput.value = '';

        for(let opinion of opinions){

            if(opinion.id !== opinionId){

                opinion.is_reply_box_shown = false;

            }
        }

    }

    const toggleReplyBox = (opinionId: number) => {

        if(getIsLoggedIn.value === true && 
        authUserOpinion.exists &&
        authUserOpinion.id === opinionId
        ){

            authUserOpinion.is_reply_box_shown = !authUserOpinion.is_reply_box_shown;

        }else{
            const matchingOpinion = opinions.findIndex(op => op.id === opinionId);
            opinions[matchingOpinion].is_reply_box_shown = !opinions[matchingOpinion].is_reply_box_shown;
        }

        closeOtherReplyBoxes(opinionId);

    }

    const closeAllReplyBoxes = () => {

        for(let opinion of opinions){
            opinion.is_reply_box_shown = false;
        }
        authUserOpinion.is_reply_box_shown = false;
        replyInput.value = '';
        replySubmitErrors.splice(0,replySubmitErrors.length);

    }

    const validateReply = () => {
        replySubmitErrors.splice(0,replySubmitErrors.length);
        let isValid = true;

        if(stringLength(stripAllWS(stripTags(replyInput.value))) < 10){
            replySubmitErrors.push('Reply is too short.');
            isValid = false;
        }

        if(stringLength(stripAllWS(stripTags(replyInput.value))) > 500){
            replySubmitErrors.push('Reply is too long.');
            isValid = false;
        }

        return isValid;
    }

    const submitReply = async (opinionId: number) => {

        if(!validateReply()){
            return;
        }

        try{

            await axios.post('http://155.138.197.17:8080/api/v1/opinion-replies', 
            {
                opinion_id: opinionId, 
                content: replyInput.value, 
                thread_slug: slug.value
            },
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            closeAllReplyBoxes();

        }catch(e: any){
            console.error(e);

            if(e.response?.data?.short_msg){
                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_DEACTIVATION'){
                    openFlashToast(MessageTypes.ERROR, 'You have been deactivated.');
                    logout();
                }else if(shortMsg === 'ERR_NOT_VERIFIED'){
                    openEmailVerifyModal();
                }else if(shortMsg === 'FROZEN'){
                    openFlashToast(MessageTypes.ERROR, 'Your account is frozen and under review by admins.');
                }else{
                    replySubmitErrors.push('An error has occurred.');
                }

            }else{
                replySubmitErrors.push('An error has occurred.');
            }
        }

    }

    const determineOpinionRemoveButtonShown = (coreRole: CoreRole) => {

        if(!getIsLoggedIn.value){
            return false;
        }else if(![CoreRole.SUPER_ADMINISTRATOR, CoreRole.ADMINISTRATOR, CoreRole.STAFF].includes(getUserData.core_role as CoreRole)){
            return false;
        }else if([CoreRole.SUPER_ADMINISTRATOR, CoreRole.ADMINISTRATOR].includes(coreRole) && getUserData.core_role === CoreRole.STAFF){
            return false;
        }

        return true;

    }

    const determineOpinionHideButtonShown = (coreRole: CoreRole, moderatorRole: ModeratorRole, authorUserId: number) => {

        if(!getIsLoggedIn.value){
            return false;
        }else if([CoreRole.SUPER_ADMINISTRATOR, CoreRole.ADMINISTRATOR, CoreRole.STAFF].includes(getUserData.core_role as CoreRole)){
            return false;
        }else if([CoreRole.SUPER_ADMINISTRATOR, CoreRole.ADMINISTRATOR, CoreRole.STAFF].includes(coreRole)){
            return false;
        }else if(moderatorRole === ModeratorRole.NONE){
            return false;
        }else if(authorUserId === getUserData.user_id){
            return false;
        }

        return true;
    }

    const determineOpinionReportButtonShown = (coreRole: CoreRole, authorUserId: number) => {

        if(getIsLoggedIn.value && getUserData.user_id === authorUserId){
            return false;
        }else if([CoreRole.SUPER_ADMINISTRATOR, CoreRole.ADMINISTRATOR, CoreRole.STAFF].includes(coreRole)){
            return false;
        }

        return true;
    }


    watch(getIsLoggedIn, (value) => {

        if(value === false){
            authUserOpinion.exists = false;
            authUserOpinion.author_username = null;
            authUserOpinion.author_user_id = null;
            authUserOpinion.content = null;
            authUserOpinion.is_reply_box_shown = false;
            authUserOpinion.id = null;
            closeAllReplyBoxes();
        }

        fetchThread();

    });

    onBeforeRouteUpdate(to => {

        slug.value = to.params.slug;

        fetchThread();

    });

    onMounted(() => {
        fetchThread();
    });

    onUnmounted(() => {
        pusher.channel = null;
        pusher.instance!.unsubscribe(`thread-${slug.value}`);
    });


</script>

<style lang="scss" scoped>
    .container{
        width:75%;
        padding:1rem;
        margin:2rem auto;
    }

    .spinner-container{
        display:flex;
        height:70rem;
        justify-content:center;
        align-items:center;
    }

    .opinions-loading-container{
        display:flex;
        justify-content:center;
    }
 
    .opinion {
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

    .opinion-form, 
    .auth-prompt {
        background:#fff;
        padding:2rem;
        border:1px solid #ccc;
        margin:2rem 0;
        border-radius:.5rem;

        h2{
            font-size:2.2rem;
            margin-bottom:1rem;
        }
    }

    .btn{
        display:inline-block;
        background:#21bf8f;
        border:none;
        padding:.8rem 1.2rem;
        color:#fff;
        font-size:1.6rem;
        font-weight:bold;
        border-radius:.5rem;
        margin:1rem 0;
    }

    .auth-prompt, 
    .closed-prompt{
        font-size:1.6rem;

        a{
            color:#11998e;
        }
    }

    .opinions{
        margin:2rem 0;

        h2{
            font-size:2.2rem;
        }
    }

    .you{
        margin-left:.5rem;
    }

    .none{
        color:#888;
        text-align:center;
        margin-top:2rem;
        font-size:2rem;
    }

    h3{
        font-size:1.8rem;
        border-bottom:1px solid #ccc;
        margin-top:2rem;
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

    .reply-icon{
        margin-right:.5rem;
    }

    .reply-btn {
        background:transparent;
        border:none;
        color:#11998e;
        padding:.5rem;
    }

    .reply-box{
        background:#fff;
        padding:1rem;
        box-shadow:0 0 .5rem rgba(0,0,0,.24);

        h4{
            font-size:1.4rem;
            margin-bottom:1rem;
        }

        .reply-textarea{
            width:100%;
            display:block;
            padding:3px;
            resize:none;
        }
    }

    .reply{
        background:#fff;
        border:1px solid #ccc;
        border-radius:.5rem;
        width:85%;
        margin-right:0;
        margin-left:auto;
        font-size:1.4rem;
        margin-top:1rem;
        margin-bottom:1rem;

        &__header{
            display:flex;
            justify-content: space-between;
            align-items: center;
            background:#33ab87;
            padding:1rem;
            color:#fff;
        }

        &__body{
            padding:1rem;
        }

        &__author{
            cursor:pointer;
        }
    }


    @media (max-width: 800px) {

        .container{
            width:100%;
        }
    }
</style>