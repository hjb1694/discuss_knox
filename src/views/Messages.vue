<template>
    <div class="container">
        <private-message-modal 
        v-if="isPrivateChatModalOpen"
        :is-open="isPrivateChatModalOpen"
        :chat-with-user-id="chatWithUserId"
        :chat-with-username="chatWithUsername"
        @close-modal="closeChatModal"
        />
        <div v-if="!getLatestMessages.length" class="no-messages">
            No messages at this moment :(
        </div>
        <div class="messages" v-else>
            <ul>
                <li 
                class="message-preview" 
                v-for="message in getLatestMessages" 
                :key="message.message_id"
                :class="{highlighted: !message.is_read && message.sender_username !== getUserData.username}"
                @click="openChat(getOtherPersonUserId(message.sender_user_id, message.receiver_user_id), getOtherPersonUsername(message.sender_username, message.receiver_username))"
                >
                    <h3>
                        <i class="user-icon fa fa-user"></i>
                        <span>{{ getOtherPersonUsername(message.sender_username, message.receiver_username) }}</span>
                    </h3>
                    <p>
                        <strong v-if="message.sender_username === getUserData.username">You: </strong>
                        {{ message.message_content.substring(0,50) }}...
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useMessagesStore } from '@/stores/useMessagesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import PrivateMessageModal from '@/components/PrivateMessageModal/PrivateMessageModal.vue';
import { useRouter } from 'vue-router';

const { getLatestMessages, clearMessages, clearCurrentChatWithUsername } = useMessagesStore();
const { getUserData, getIsLoggedIn } = useAuthStore();
const { push: routerPush } = useRouter();

const isPrivateChatModalOpen = ref<boolean>(false);
const chatWithUserId = ref<number>(0);
const chatWithUsername = ref<string>('');

const getOtherPersonUsername = (senderUsername: string, receiverUsername: string) => {

    return senderUsername === getUserData.username ? receiverUsername : senderUsername;

}

const getOtherPersonUserId = (senderUserId: number, receiverUserId: number) => {

    return senderUserId === getUserData.user_id ? receiverUserId : senderUserId;
}

const openChat = (otherPersonUserId: number, otherPersonUsername: string) => {

    chatWithUserId.value = otherPersonUserId;
    chatWithUsername.value = otherPersonUsername;
    isPrivateChatModalOpen.value = true;

}

const closeChatModal = () => {
    isPrivateChatModalOpen.value = false;
    chatWithUserId.value = 0;
    chatWithUsername.value = '';
}




watch(getIsLoggedIn, (val) => {

    if(val === false){
        clearMessages();
        routerPush('/');
    }

});



</script>

<style lang="scss" scoped>
    .container{
        width:75%;
        margin: 2rem auto;
    }

    .messages ul{
        list-style:none;
        border:1px solid #ccc;
    }

    .message-preview{
        background:#fff;
        padding:1rem;
        cursor:pointer;

        h3{
            font-weight:normal;
            font-size:1.6rem;

            .user-icon{
                margin-right:.5rem;
            }
        }

        p{
            font-size:1.2rem;


        }

        &:not(:last-child){
            border-bottom:1px solid #ccc;
        }

        &.highlighted{
            background:#e6fff1;
            
            h3, p{
                font-weight:bold;
            }
        }
    }

</style>