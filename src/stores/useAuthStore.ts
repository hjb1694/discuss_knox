import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';

interface UserData {
    user_id: number | null, 
    username: string | null, 
    core_role: string | null, 
    moderator_role: string | null, 
    account_status: string | null
}

export const useAuthStore = defineStore('useAuthStore', () => {

    const isLoggedIn = ref<boolean>(false);
    const authToken = ref<string>('');
    const userData = reactive<UserData>({
        user_id: null, 
        username: null,
        core_role: null, 
        moderator_role: null, 
        account_status: null
    });

    const getIsLoggedIn = computed(() => isLoggedIn);
    const getAuthToken = computed(() => authToken);
    const getUserData = computed(() => userData);


    const login = (token: string, userId: number, username: string, coreRole: string, moderatorRole: string, account_status: string) => {

        isLoggedIn.value = true;
        authToken.value = token;
        userData.user_id = userId;
        userData.username = username;
        userData.core_role = coreRole;
        userData.moderator_role = moderatorRole;

    }

    return {
        getIsLoggedIn, 
        getAuthToken, 
        getUserData, 
        login
    }

});