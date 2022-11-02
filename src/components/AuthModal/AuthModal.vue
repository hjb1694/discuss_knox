<template>
    <div class="auth-modal">
        <div class="auth-modal__backdrop"></div>
        <div class="auth-modal__dialog">
            <header class="auth-modal__header">
                <div class="auth-modal__toggle-btns">
                    <button @click="toggleToRegistration" class="register-btn toggle-btn">Register</button>
                    <button @click="toggleToLogin" class="login-btn toggle-btn">Login</button>
                </div>
                <button class="auth-modal__close-btn">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section class="auth-modal__body">
                <div class="registration-part" v-if="isRegistrationShown">
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
                            <date-picker v-model="registrationFormFields.dob" :upper-limit="upperLimitDOB"/>
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
                    </div>
                    <div class="registration-agree" v-show="regStepIsShown[5]">
                        <h2 class="section-heading fade-in-down">
                            <p>Lastly, please agree to the following: </p> 
                        </h2>
                        <div class="fade-in-up delay">
                            <div class="fgrp">
                                <checkbox-input v-model="registrationFormFields.agreeTos" input-id="agree-tos" label="I agree to Ktown Portal's Privacy Policy and Terms of Service"/>
                            </div>
                            <div class="fgrp">
                                <checkbox-input v-model="registrationFormFields.agreeRules" input-id="agree-rules" label="I agree to abide by Ktown Portal's rules and regulations regarding usage of its platforms."/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="login-part" v-if="isLoginShown">
                    <div class="login-form">
                        <h2 class="section-heading">Sign In to Ktown Portal</h2>
                        <div class="fgrp">
                            <text-input label="Email" />
                        </div>
                        <div class="fgrp"> 
                            <text-input label="Password" />
                        </div>
                        <div class="fgrp">
                            <a class="forgot-password-btn">Forgot Password</a>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="auth-modal__footer">
                <template v-if="isRegistrationShown">
                    <button v-if="currentRegStep === 0" class="btn" @click="regNext">Create My Account</button>
                    <button class="btn" @click="regNext" v-if="currentRegStep > 0 && currentRegStep < regStepIsShown.length - 1">Next</button>
                    <button class="btn" v-if="currentRegStep === 5">Finish</button>
                </template>
                <template v-if="isLoginShown">
                    <button class="btn">Login</button>
                </template>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive } from 'vue';
    import datePicker from 'vue3-datepicker';
    import textInput from '@/components/ui_elements/TextInput.vue';
    import checkboxInput from '@/components/ui_elements/CheckboxInput.vue';
    import { DateTime } from 'luxon';

    const isRegistrationShown = ref<boolean>(true);
    const isLoginShown = ref<boolean>(false);
    const currentRegStep = ref<number>(0);
    const upperLimitDOB = new Date();

    const registrationFormFields = reactive({
        dob: new Date(), 
        email: '', 
        username: '', 
        password: '', 
        confirmPassword: '', 
        agreeTos: false, 
        agreeRules: false
    });

    const registrationErrors = reactive({
        dob: [], 
        email: [], 
        username: [], 
        password: [], 
        agrees: []
    });

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

            if(now.diff(userDobInput, 'years').toObject().years < 13){
                registrationErrors.dob.push('You must be at least 13 years of age to join.');
                return false;
            }

            if(now.diff(userDobInput, 'years').toObject().years > 100){
                registrationErrors.dob.push('Invalid date input.');
                return false;
            }


            return true;

        }, 
        // Validate Email
        async function(){

            registrationErrors.email = [];

        }, 
        // Validate Username
        function(){}, 
        // Validate Password
        function(){}, 
        // Validate TOS and Rule Agreements
        function(){}
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
        registrationFormFields.agreeTos = '';
        registrationFormFields.agreeRules = '';
        registrationErrors.dob = []; 
        registrationErrors.email = [];
        registrationErrors.username = [];
        registrationErrors.password = [];
        registrationErrors.agrees = [];
    }

    const toggleToLogin = () => {
        isRegistrationShown.value = false;
        isLoginShown.value = true;
        resetRegistration();
    }

    const toggleToRegistration = () => {
        isRegistrationShown.value = true;
        isLoginShown.value = false;
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
                height:30rem;
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

        .errbox{
            color:#f00;
            margin-top:2rem;
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