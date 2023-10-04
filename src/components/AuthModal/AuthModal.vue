<template>
    <div class="auth-modal" v-if="isOpen">
        <div class="auth-modal__backdrop" @click="closeModal"></div>
        <div class="auth-modal__dialog">
            <header class="auth-modal__header">
                <div class="auth-modal__toggle-btns">
                    <button @click="toggleToRegistration" class="register-btn toggle-btn" :disabled="regFinishProcessing || isLoginProcessing">Register</button>
                    <button @click="toggleToLogin" class="login-btn toggle-btn" :disabled="regFinishProcessing || isLoginProcessing">Login</button>
                </div>
                <button class="auth-modal__close-btn" @click="closeModal">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="auth-modal__body">
                <!-- REGISTER -->
                <div class="registration-part" v-if="isRegistrationShown">
                    <div v-show="!regFinishProcessing">
                        <div class="registration-briefing" v-show="regStepIsShown[0]">
                            <h2 class="section-heading">Create a Ktown Portal Account</h2>
                            <div class="benefits-list">
                                <div class="benefits-list__item"> 
                                    <div class="bullet">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="text">Use your account across multiple Ktown Portal sites.</div>
                                </div>
                                <div class="benefits-list__item"> 
                                    <div class="bullet">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="text">Earn points for participation. Redeem those points for rewards.</div>
                                </div>
                                <div class="benefits-list__item"> 
                                    <div class="bullet">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="text">Help fellow Knoxvillians, visitors, and prospective residents.</div>
                                </div>
                            </div>
                        </div>
                        <div class="dob-selection" v-show="regStepIsShown[1]"> 
                            <h2 class="section-heading fade-in-down">First thing's first, what is your date of birth?</h2>
                            <div class="fade-in-up delay">
                                <date-picker @click="isDatepickerHintShown = false" v-model="registrationFormFields.dob" :upper-limit="upperLimitDOB"/>
                            </div>
                            <div v-if="isDatepickerHintShown" class="datepicker-hint fade-in-up delay-2">
                                <strong>HINT:</strong> To select the year, click the month and year on the top of the datepicker, then click the year. 
                                You will then see a range of years to choose from.
                            </div>
                            <div v-if="registrationErrors.dob.length" class="errbox">
                                <p v-for="error of registrationErrors.dob" :key="error" >{{ error }}</p>
                            </div>
                        </div>
                        <div class="registration-email" v-show="regStepIsShown[2]">
                            <h2 class="section-heading fade-in-down">What is your email address?</h2>
                            <div class="fade-in-up delay">
                                <text-input v-model="registrationFormFields.email" label="Email" input-type="email" class="registration-email__input"/>
                            </div>
                            <div v-if="registrationErrors.email.length" class="errbox">
                                <p v-for="error of registrationErrors.email" :key="error" >{{ error }}</p>
                            </div>
                        </div>
                        <div class="registration-username" v-show="regStepIsShown[3]">
                            <h2 class="section-heading fade-in-down">
                                <p>Create a Username</p> 
                                <p class="section-heading__sub">(C'mon! Be creative!)</p>
                            </h2>
                            <div class="fade-in-up delay">
                                <text-input v-model="registrationFormFields.username" label="Username" class="registration-username__input"/>
                            </div>
                            <div class="criteria fade-in-up delay-2">
                                <h3>Criteria</h3>
                                <ol>
                                    <li>Only alphabetical letters and numbers</li>
                                    <li>No spaces or special characters</li>
                                    <li>Must be between 6 and 12 characters</li>
                                </ol>
                            </div>
                            <div v-if="registrationErrors.username.length" class="errbox">
                                <p v-for="error of registrationErrors.username" :key="error" >{{ error }}</p>
                            </div>
                        </div>
                        <div class="registration-password" v-show="regStepIsShown[4]">
                            <h2 class="section-heading fade-in-down">
                                <p>Now, create your password</p> 
                                <p class="section-heading__sub">(You're almost done!)</p>
                            </h2>
                            <div class="fade-in-up delay">
                                <div class="fgrp">
                                    <text-input v-model="registrationFormFields.password" label="Password" input-type="password" class="registration-password__input"/>
                                </div>
                                <div class="fgrp">
                                    <text-input v-model="registrationFormFields.confirmPassword" label="Confirm Password" input-type="password" class="registration-password__input"/>
                                </div>
                            </div>
                            <div class="criteria fade-in-up delay-2">
                                <h3>Criteria</h3>
                                <ol>
                                    <li>Must contain at least one uppercase letter</li>
                                    <li>Must contain at least one lowercase letter</li>
                                    <li>Must contain at least one number</li>
                                    <li>Must be between 8 and 50 characters</li>
                                </ol>
                            </div>
                            <div v-if="registrationErrors.password.length" class="errbox">
                                <p v-for="error of registrationErrors.password" :key="error" >{{ error }}</p>
                            </div>
                        </div>
                        <div class="registration-agree" v-show="regStepIsShown[5]">
                            <h2 class="section-heading fade-in-down">
                                <p>Lastly, please agree to the following: </p> 
                            </h2>
                            <div class="fade-in-up delay">
                                <div class="fgrp">
                                    <checkbox-input v-model="registrationFormFields.agreeTos" input-id="agree-tos" label="I agree to Ktown Portal's Privacy Policy and Terms of Service" />
                                </div>
                                <div class="fgrp">
                                    <checkbox-input v-model="registrationFormFields.agreeRules" input-id="agree-rules" label="I agree to abide by Ktown Portal's rules and regulations regarding usage of its platforms." />
                                </div>
                            </div>
                            <div v-if="registrationErrors.agrees.length" class="errbox">
                                <p v-for="error of registrationErrors.agrees" :key="error" >{{ error }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="registration-processing" v-if="regFinishProcessing">
                        <h2 class="section-heading fade-in-down">
                            <p>Processing. Please wait...</p> 
                            <p class="section-heading__sub">Do not close this window.</p>
                        </h2>
                    </div>
                </div>
                <!-- LOGIN -->
                <div class="login-part" v-if="isLoginShown">
                    <div v-if="!isForgotPasswordFormShown" class="login-form">
                        <h2 class="section-heading">Sign In to Ktown Portal</h2>
                        <div class="fgrp">
                            <text-input v-model="loginFormFields.email" input-type="email" label="Email" :disabled="isLoginProcessing"/>
                        </div>
                        <div class="fgrp"> 
                            <text-input v-model="loginFormFields.password" input-type="password" label="Password" :disabled="isLoginProcessing"/>
                        </div>
                        <div class="fgrp">
                            <a class="forgot-password-btn" @click="showForgotPasswordForm">Forgot Password</a>
                        </div>
                        <div v-if="loginErrors.length" class="errbox">
                            <p v-for="error of loginErrors" :key="error">{{ error }}</p>
                        </div>
                    </div>
                    <div v-else class="forgot-password-form">
                        <h2 class="section-heading">Forgot Your Password?</h2>
                        <p class="section-text">Provide your email address below, and if our records match, we will send you a new password.</p>
                        <div class="fgrp">
                            <text-input v-model="forgotPasswordEmail" input-type="email" label="Email" />
                        </div>
                        <div v-if="forgotPasswordFormErrors.length" class="errbox">
                            <p v-for="error of forgotPasswordFormErrors" :key="error">{{ error }}</p>
                        </div>
                        <div v-if="forgotPasswordProcessSuccess" class="success-box">
                            <p>Success! Check your inbox for your new password.</p>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="auth-modal__footer">
                <template v-if="isRegistrationShown">
                    <button v-if="currentRegStep === 0" class="btn" @click="regNext">Create My Account</button>
                    <button class="btn" @click="regNext" v-if="currentRegStep > 0 && currentRegStep < regStepIsShown.length - 1">Next</button>
                    <button class="btn" @click="regFinish" v-if="currentRegStep === 5" :disabled="regFinishProcessing">
                        <span v-if="!regFinishProcessing">Finish</span>
                        <span v-else>Processing...</span>
                    </button>
                </template>
                <template v-if="isLoginShown">
                    <button class="btn" v-if="!isForgotPasswordFormShown" @click="login" :disabled="isLoginProcessing">
                        <span v-if="!isLoginProcessing">Login</span>
                        <span v-else>Processing...</span>
                    </button>
                    <button class="btn" v-else @click="processForgotPassword" :disabled="isLoginProcessing">
                        <span v-if="!isForgotPasswordProcessing">Submit</span>
                        <span v-else>Processing...</span>
                    </button>
                </template>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, defineProps, defineEmits } from 'vue';
    import datePicker from 'vue3-datepicker';
    import textInput from '@/components/ui_elements/TextInput.vue';
    import checkboxInput from '@/components/ui_elements/CheckboxInput.vue';
    import { DateTime } from 'luxon';
    import isEmail from 'validator/es/lib/isEmail';
    import axios from 'axios';
    import stringLength from 'string-length';
    import { useCoreModalStore } from '@/stores/useCoreModalStore';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import { AccountStatus } from '@/types';

    interface RegistrationErrors {
        dob: string[];
        email: string[];
        username: string[];
        password: string[];
        agrees: string[];
    }

    const props = defineProps({
        isOpen: {
            type: Boolean, 
            default: false
        }
    });

    const emit = defineEmits(['closeModal']);

    const isRegistrationShown = ref<boolean>(true);
    const isLoginShown = ref<boolean>(false);
    const currentRegStep = ref<number>(0);
    const upperLimitDOB = new Date();
    const regFinishProcessing = ref<boolean>(false);

    const isDatepickerHintShown = ref<boolean>(true);


    const isLoginProcessing = ref<boolean>(false);

    const isForgotPasswordFormShown = ref<boolean>(false);
    const isForgotPasswordProcessing = ref<boolean>(false);

    const { closeAuthModal, openEmailVerifyModal } = useCoreModalStore();
    const { login: loginUser } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();

    const registrationFormFields = reactive({
        dob: new Date(), 
        email: '', 
        username: '', 
        password: '', 
        confirmPassword: '', 
        agreeTos: false, 
        agreeRules: false
    });

    const registrationErrors = reactive<RegistrationErrors>({
        dob: [], 
        email: [], 
        username: [], 
        password: [], 
        agrees: []
    });

    const loginFormFields = reactive({
        email: '',
        password: ''
    });

    const forgotPasswordEmail = ref<string>('');

    const loginErrors = reactive<string[]>([]);

    const forgotPasswordFormErrors = reactive<string[]>([]);

    const forgotPasswordProcessSuccess = ref<boolean>(false);

    const regStepIsShown = reactive([true, false, false, false, false, false]);


    const registrationValidation = [
        function(){
            return true;
        }, 
        // Validate DOB
        function(){

            registrationErrors.dob = [];

            const now = DateTime.now();
            const userDobInput = DateTime.fromJSDate(registrationFormFields.dob);

            if(now.diff(userDobInput, 'years').toObject().years! < 13){
                registrationErrors.dob.push('You must be at least 13 years of age to join.');
                return false;
            }

            if(now.diff(userDobInput, 'years').toObject().years! > 100){
                registrationErrors.dob.push('Invalid date input.');
                return false;
            }


            return true;

        }, 
        // Validate Email
        async function(){

            registrationErrors.email = [];

            if(!isEmail(registrationFormFields.email)){
                registrationErrors.email.push('Invalid email address.');
                return false;
            }

            try{
                const response = await axios.post('http://206.189.193.136:3001/api/v1/validate-new-email', {
                    email: registrationFormFields.email
                });
                return true;
            }catch(err: any){
                if(err.response?.data?.short_msg){
                    const shortMsg = err.response.data.short_msg;

                    if(shortMsg === 'ERR_EMAIL_EXISTS'){
                        registrationErrors.email.push('This email address already exists.');
                    }else{
                        registrationErrors.email.push('An unexpected error has occurred.');
                    }

                }else{
                    registrationErrors.email.push('An unexpected error has occurred.');
                }
                return false;
            }


        }, 
        // Validate Username
        async function(){

            registrationErrors.username = [];

            if(!/^[A-Z0-9]{6,12}$/i.test(registrationFormFields.username)){
                registrationErrors.username.push('Provided username does not meet criteria.');
                return false;
            }

            try{

                await axios.post('http://206.189.193.136:3001/api/v1/validate-new-username', {
                    username: registrationFormFields.username
                });
                return true;

            }catch(err: any){

                if(err.response?.data?.short_msg){
                    const shortMsg = err.response.data.short_msg;

                    if(shortMsg === 'ERR_USERNAME_EXISTS'){
                        registrationErrors.username.push('This username already exists.');
                    }else{
                        registrationErrors.username.push('An unexpected error has occurred.');
                    }

                }else{
                    registrationErrors.username.push('An unexpected error has occurred.');
                }
                return false;
            }


        }, 
        // Validate Password
        function(){

            registrationErrors.password = [];
            let isValid = true;

            const passwordRegs = {
                uppercase: /[A-Z]/, 
                lowercase: /[a-z]/, 
                numeric: /[0-9]/
            }

            const password = registrationFormFields.password;
            const confirmPassword = registrationFormFields.confirmPassword;

            if(
                !passwordRegs.uppercase.test(password) ||
                !passwordRegs.lowercase.test(password) ||
                !passwordRegs.numeric.test(password) ||
                stringLength(password) < 8 || 
                stringLength(password) > 50
            ) {
                registrationErrors.password.push('Password does not meet criteria.');
                isValid = false;
            }


            if(password !== confirmPassword){
                registrationErrors.password.push('Confirm password does not match password.');
                isValid = false;
            }


            return isValid;

        }, 
        // Validate TOS and Rule Agreements
        function(){

            registrationErrors.agrees = [];

            if(
                !registrationFormFields.agreeTos ||
                !registrationFormFields.agreeRules
            ){
                registrationErrors.agrees.push('Please agree to the above.');
                return false;
            }

            return true;

        }
    ]

    const regNext = async () => {

        const passed = await registrationValidation[currentRegStep.value]();

        if(!passed){
            return;
        }

        currentRegStep.value++;
        regStepIsShown.forEach((item, idx) => regStepIsShown[idx] = false);
        regStepIsShown[currentRegStep.value] = true;
        console.log(regStepIsShown);
    }

    const resetRegistration = () => {
        currentRegStep.value = 0;
        regStepIsShown.forEach((item, idx) => regStepIsShown[idx] = false);
        regStepIsShown[0] = true;
        registrationFormFields.dob = new Date();
        registrationFormFields.email = '';
        registrationFormFields.username = '';
        registrationFormFields.password = '';
        registrationFormFields.confirmPassword = '';
        registrationFormFields.agreeTos = false;
        registrationFormFields.agreeRules = false;
        registrationErrors.dob = []; 
        registrationErrors.email = [];
        registrationErrors.username = [];
        registrationErrors.password = [];
        registrationErrors.agrees = [];
    }

    const resetLogin = () => {
        loginFormFields.email = '';
        loginFormFields.password = '';
    }

    const toggleToLogin = () => {
        isRegistrationShown.value = false;
        isLoginShown.value = true;
        isForgotPasswordFormShown.value = false;
        forgotPasswordProcessSuccess.value = false;
        forgotPasswordFormErrors.splice(0,forgotPasswordFormErrors.length);
        resetRegistration();
    }

    const toggleToRegistration = () => {
        isRegistrationShown.value = true;
        isLoginShown.value = false;
    }

    const regFinish = async () => {

        if(!registrationValidation[5]()){
            return;
        }

        regFinishProcessing.value = true;

        try{

            const response = await axios.post('http://206.189.193.136:3001/api/v1/register', {
                email: registrationFormFields.email, 
                username: registrationFormFields.username, 
                password: registrationFormFields.password, 
                dob: DateTime.fromJSDate(registrationFormFields.dob).toFormat('yyyy-MM-dd')
            });

            const { token, user_id, username, core_role, moderator_role, account_status } = response.data.body;

            loginUser(token, user_id, username, core_role, moderator_role, account_status);

            openEmailVerifyModal();

            closeAuthModal();

        }catch(e){
            
            registrationErrors.agrees.push('There was an error processing your request.');

        }finally{
            regFinishProcessing.value = false;
        }

    }

    const validateLogin = () => {
        loginErrors.splice(0,loginErrors.length);
        let isValid = true;

        if(!isEmail(loginFormFields.email)){
            loginErrors.push('Please provide a valid email address.');
            isValid = false;
        }

        if(stringLength(loginFormFields.password) < 1){
            loginErrors.push('Please provide a password.');
            isValid = false;
        }

        return isValid;
    }


    const login = async () => {
        if(!validateLogin()){
            return;
        }

        isLoginProcessing.value = true;

        try{

            const response = await axios.post('http://206.189.193.136:3001/api/v1/login', {
                email: loginFormFields.email, 
                password: loginFormFields.password
            });

            const { token, user_id, username, core_role, moderator_role, account_status } = response.data.body;

            loginUser(token, user_id, username, core_role, moderator_role, account_status);

            if(account_status === AccountStatus.NOT_VERIFIED){
                openEmailVerifyModal();
            }

            loginFormFields.email = '';
            loginFormFields.password = '';

            openFlashToast(MessageTypes.SUCCESS, 'Login Successful!');

            closeAuthModal();


        }catch(e: any){

            if(e.response.data?.short_msg){

                const shortMsg = e.response.data.short_msg;

                if(shortMsg === 'ERR_USER_NOT_EXIST' || shortMsg === 'ERR_INVALID_LOGIN_CREDENTIALS'){
                    loginErrors.push('Invalid login credentials.');
                }else if(shortMsg === 'ERR_USER_DEACTIVATED'){
                    loginErrors.push('This user has been deactivated.');
                }else{
                    loginErrors.push('An unexpected error has occurred.');
                }
            }else{
                loginErrors.push('An unexpected error has occurred.');
            }

        }finally{
            isLoginProcessing.value = false;
        }
    }

    const showForgotPasswordForm = () => {
        isForgotPasswordFormShown.value = true;
    }

    const processForgotPassword = async () => {
        isForgotPasswordProcessing.value = true;

        forgotPasswordFormErrors.splice(0,forgotPasswordFormErrors.length);

        if(!isEmail(forgotPasswordEmail.value)){
            forgotPasswordFormErrors.push('Please enter a valid email address.');
            isForgotPasswordProcessing.value = false;
            return;
        }

        try{

            await axios.post('http://206.189.193.136:3001/api/v1/forgot-password', {
                email: forgotPasswordEmail.value
            });

            forgotPasswordProcessSuccess.value = true;
            forgotPasswordEmail.value = '';

        }catch(e){
            console.error(e);
            forgotPasswordFormErrors.push('There was an issue processing your request.');

        }finally{
            isForgotPasswordProcessing.value = false;
        }


    }

    const closeModal = () => {
        resetRegistration();
        resetLogin();
        loginErrors.splice(0,loginErrors.length);
        emit('closeModal');
    }
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

        &__toggle-btns{

            display:flex;
            align-items:center;

            .toggle-btn{
                font-size:1.8rem;
                background:transparent;
                border:none;
                color:#888;
            }

            .register-btn{
                margin-right:2rem;
            }
        }

        &__close-btn{
            color:#aaa;
            font-size:3rem;
            background:transparent;
            border:none;
        }

        &__body{
            padding:1rem;
            min-height:38rem;

            .registration-part{
                height:38rem;
                overflow-y:auto;
            }
        }

        .section-heading{
            font-size:2.4rem;
            color:#555;
            text-align:center;
            padding:2rem;

            &__sub{
                font-size:1.6rem;
                font-style:italic;
                color:#777;
            }
        }

        .benefits-list{

            box-shadow:0 0 .5rem rgba(0,0,0,.24);

            &__item{
                display:flex;
                align-items:center;
                padding:.5rem;

                &:nth-child(odd){
                    background:rgba(0,0,0,.04);
                }

                .bullet{
                    margin-right:2rem;
                }

                .bullet i{
                font-size:2.5rem;
                color:#35dba9;
                }

                .text{
                    font-size:1.8rem;
                }
            }

        }

        .btn{
            display:block;
            background:#21bf8f;
            border:none;
            padding:.8rem 1.2rem;
            color:#fff;
            font-size:1.6rem;
            font-weight:bold;
            border-radius:.5rem;
        }

        &__footer{
            padding:1rem;
            border-top:1px solid #eee;
            display:flex;
            justify-content:flex-end;
        }

        .dob-selection, 
        .registration-email, 
        .registration-username, 
        .registration-password {
            height:100%;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            font-size:1.4rem;
        }

        .registration-email__input, 
        .registration-username__input, 
        .registration-password__input {
            width:30rem;
        }

        .fgrp{
            margin:1rem 0;
        }

        .fade-in-down{
            animation:fade-in-down 1.8s both;
        }

        .fade-in-up{
            animation:fade-in-up 1.8s both;
        }

        .delay{
            animation-delay:.8s;
        }

        .delay-2{
            animation-delay:1.5s;
        }

        .criteria{
            margin-top:2rem;

            ol{
                list-style-position:inside;
            }

            &::marker{
                font-weight:bold;
            }
        }

        .forgot-password-btn{
            display:block;
            text-align:center;
            font-size:1.4rem;
            color:#888;
            margin-top:2rem;
        }

        .datepicker-hint{
            margin-top:1rem;
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

        .success-box{
            color:#39bd41;
            margin-top:2rem;
            font-size:1.4rem;
            background:#d4fcd7;
            border:1px solid #39bd41;
            padding:1rem;
            border-radius:.5rem;
        }

        .section-text{
            font-size:1.4rem;
        }
    }

    @keyframes fade-in-down {
        from{
            transform:translateY(-2rem);
            opacity:0;
        }
        to{
            transform:translateY(0);
            opacity:1;
        }
    }

    @keyframes fade-in-up {
        from{
            transform:translateY(2rem);
            opacity:0;
        }
        to{
            transform:translateY(0);
            opacity:1;
        }
    }
</style>
