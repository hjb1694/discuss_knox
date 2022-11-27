<template>
    <div v-if="isOpen" class="private-message-modal">
        <div class="private-message-modal__backdrop" @click="closeModal"></div>
        <div class="private-message-modal__dialog">
            <header class="private-message-modal__header">
                <h2>Chat with {{ chatWithUsername }}</h2>
                <button class="private-message-modal__close-btn" @click="closeModal">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="private-message-modal__body">
                <div class="messages-area" ref="messagesArea">
                    <div v-if="isFetchMessagesProcessing" class="spinner-container">
                        <img src="@/assets/ring-spinner.svg" alt="Loading..."/>
                    </div>
                    <template v-if="!isFetchMessagesProcessing && messages.length">
                        <div v-for="(message, idx) in messages" :key="message.message_id" :class="{'right': message.sender_user_id === getUserData.user_id, 'left': message.sender_user_id === chatWithUserId}">
                            <div class="message-bubble" :class="{'grey': message.sender_user_id === getUserData.user_id, 'green': message.sender_user_id === chatWithUserId}">
                                {{ message.message_body }}
                                {{ getUserData.userId }}
                            </div>
                        </div>
                    </template>
                </div>
                <textarea v-model="newMessageContent" class="textarea" placeholder="Your Message Here"></textarea>
            </section>
            <footer class="private-message-modal__footer">
                <button class="send-btn" @click="sendMessage" :disabled="isSending">Send</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps, defineEmits, ref, reactive, onMounted, nextTick } from 'vue';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { usePusherStore } from '@/stores/usePusherStore';
    import { useMessagesStore } from '@/stores/useMessagesStore';

    const props = defineProps({
        isOpen: {
            type: Boolean, 
            default: false
        },
        chatWithUsername: {
            type: String, 
            required: true
        }, 
        chatWithUserId: {
            type: Number, 
            required: true
        }
    });

    const emit = defineEmits(['closeModal']);

    const messagesArea = ref();

    const { getAuthToken, getUserData, getIsLoggedIn } = useAuthStore();
    const { getPusherInstance } = usePusherStore();
    const { markAsRead, clearCurrentChatWithUsername, setCurrentChatWithUsername } = useMessagesStore();

    const newMessageContent = ref<string>('');
    const isSending = ref<boolean>(false);
    const messages = reactive([]);
    const isFetchMessagesProcessing = ref<boolean>(true);

    const scrollToBottom = () => {
        setTimeout(() => {
            if(props.isOpen){
                document.querySelector('.messages-area')!.scrollTo({
                    top: document.querySelector('.messages-area')!.scrollHeight - 300, 
                    behavior: 'smooth'
                });
            }
        },100);
    }

    const fetchMostRecentMessages = async () => {

        isFetchMessagesProcessing.value = true;
        
        try{

            const response = await axios.get(`http://66.42.81.246:8080/api/v1/private-message/${props.chatWithUserId}`, {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            messages.splice(0,messages.length);

            await nextTick();

            scrollToBottom();

            messages.push(...response.data.body.reverse());

            response.data.body.forEach((msg: any) => markAsRead(msg.message_id))


        }catch(e){

            console.error(e);

        }finally{
            isFetchMessagesProcessing.value = false;
        }


    }

    const sendMessage = async () => {
        isSending.value = true;

        try{

            await axios.post('http://66.42.81.246:8080/api/v1/private-message', {
                receiver_user_id: props.chatWithUserId, 
                message: newMessageContent.value
            }, {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            })

            newMessageContent.value = '';

        }catch(e){

            console.error(e);

        }finally{
            isSending.value = false;
            fetchMostRecentMessages();
        }
    }


    const closeModal = () => {
        clearCurrentChatWithUsername();
        emit('closeModal');
    }


    onMounted(() => {

        if(getIsLoggedIn.value){

            setCurrentChatWithUsername(props.chatWithUsername);

            fetchMostRecentMessages();

            getPusherInstance.channel.bind('new-message', (data: any) => {

                    if(data.sender_user_id === props.chatWithUserId){
                        fetchMostRecentMessages();
                    }

            });

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
                overflow:hidden;
                overflow-y:auto;
                padding:2rem;
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

        .left, 
        .right{
            display:flex;
        }

        .left{
            justify-content:flex-start;
        }

        .right{
            justify-content:flex-end;
        }

        .message-bubble{
            padding:1rem;
            border-radius:.5rem;
            margin-bottom:1rem;
            font-size:1.2rem;
        }

        .grey{
            background:#bbb;
        }

        .green{
            background:green;
            color:#fff;
        }

        .spinner-container{
            height:100%;
            display:flex;
            justify-content: center;
            align-items: center;
        }


    }

</style>