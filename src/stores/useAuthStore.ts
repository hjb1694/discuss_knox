import { defineStore } from 'pinia';
import { ref, reactive, computed } from 'vue';
import { usePusherStore } from '@/stores/usePusherStore';

interface UserData {
    user_id: number | null, 
    username: string | null, 
    core_role: string | null, 
    moderator_role: string | null, 
    account_status: string | null
}

export const useAuthStore = defineStore('useAuthStore', () => {

    const { createPusherInstance } = usePusherStore();

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

    const setAccountStatus = (status: string) => {
        userData.account_status = status;
        sessionStorage.setItem('account-status', status);
    }


    const login = (token: string, userId: number, username: string, coreRole: string, moderatorRole: string, account_status: string) => {

        isLoggedIn.value = true;
        authToken.value = token;
        userData.user_id = userId;
        userData.username = username;
        userData.core_role = coreRole;
        userData.moderator_role = moderatorRole;
        userData.account_status = account_status;

        sessionStorage.setItem('auth-token', authToken.value);
        sessionStorage.setItem('user-id', String(userData.user_id));
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('core-role', userData.core_role);
        sessionStorage.setItem('moderator-role', userData.moderator_role);
        sessionStorage.setItem('account-status', userData.account_status!);

        createPusherInstance(token, userId);

    }

    const autoLogin = () => {

        const sessAuthTok = sessionStorage.getItem('auth-token');

        if(sessAuthTok){
            isLoggedIn.value = true;
            authToken.value = sessAuthTok;
            userData.user_id = +sessionStorage.getItem('user-id')!;
            userData.username = sessionStorage.getItem('username');
            userData.core_role = sessionStorage.getItem('core-role');
            userData.moderator_role = sessionStorage.getItem('moderator-role');
            userData.account_status = sessionStorage.getItem('account-status');
        }

        createPusherInstance(sessAuthTok!, userData.user_id!);

        return userData.account_status;

    }


    const logout = () => {

        isLoggedIn.value = false;
        authToken.value = '';
        userData.user_id = null;
        userData.username = null;
        userData.core_role = null;
        userData.moderator_role = null;
        userData.account_status = null;

        sessionStorage.clear();

    }

    return {
        getIsLoggedIn, 
        getAuthToken, 
        getUserData,
        setAccountStatus, 
        login, 
        autoLogin, 
        logout
    }

});