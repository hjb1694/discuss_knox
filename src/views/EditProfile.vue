<template>
    <div>
        <change-image-modal v-if="isChangeImageModalShown" @close-modal="isChangeImageModalShown = false"/>
        <div class="container">
            <div class="edit-profile-image-area">
                <img class="current-profile-image" src="@/assets/no_user.png" alt="profile image" />
                <button class="btn" @click="isChangeImageModalShown = true">Change Profile Image</button>
            </div>
            <form class="edit-profile-form" @submit.prevent>
                <div class="fgrp">
                    <label class="label">Gender</label>
                    <app-multi-select v-model="genderVal" :options="genderOptions"></app-multi-select>
                </div>
                <div class="fgrp">
                    <label class="label">Occupation</label>
                    <app-multi-select v-model="occVal" :options="occupationOptions"></app-multi-select>
                </div>
                <div class="location">
                    <label>Location</label>
                    <text-input v-model="zipVal" input-type="number" @input="checkZip" label="Enter Zip Code" max="99999" :error="zipHasError"/>
                    <div v-if="cityState" class="city-state-display">
                        <strong>Your Location: </strong> {{ cityState }}
                    </div>
                </div>
                <div class="fgrp">
                    <label>Bio</label>
                    <quill-editor 
                    theme="snow"
                    content-type="html"
                    v-model:content="bioContent"
                    ref="quill"
                    />
                </div>
                <div class="fgrp">
                    <button @click="submit" class="btn">Update</button>
                </div>
                <div v-if="submissionErrors.length" class="errbox">
                    <p v-for="error in submissionErrors" :key="error">{{ error }}</p>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted } from "vue";
    import appMultiSelect from 'vue-multiselect';
    import TextInput from '@/components/ui_elements/TextInput.vue';
    import zipcodes from 'zipcodes';
    import { QuillEditor } from '@vueup/vue-quill';
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import { decode as htmlEntitiesDecode } from 'html-entities';
    import sanitizeHTML from 'sanitize-html';
    import stringLength from 'string-length';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/useAuthStore';
    import { useFlashToastStore, MessageTypes } from '@/stores/useFlashToastStore';
    import ChangeImageModal from '@/components/ChangeImageModal/ChangeImageModal.vue';

    const { getAuthToken, getUserData } = useAuthStore();
    const { openFlashToast } = useFlashToastStore();

    const isChangeImageModalShown = ref<boolean>(false);

    const genderVal = ref<string>('');
    const occVal = ref<string>('');
    const zipVal = ref<string>('');
    const cityState = ref<string>('');
    const bioContent = ref<string>('');
    const quill = ref();

    const zipHasError = ref<boolean>(false);
    const submissionErrors = reactive<string[]>([]);

    const genderOptions = ['Male','Female'];

    const occupationOptions = [
        'Finance', 
        'Healthcare', 
        'Technology', 
        'Food Service', 
        'Construction', 
        'Maintenance',
        'Education', 
        'Childcare', 
        'Student', 
        'Government', 
        'Public Safety + Security', 
        'Retail'
    ];

    const checkZip = () => {
        zipHasError.value = false;

        if(zipVal.value.length === 0){
            cityState.value = '';
            return;
        }

        if((zipVal.value.length > 0 && zipVal.value.length < 5) || zipVal.value.length > 5){
            zipHasError.value = true;
            cityState.value = '';
            return;
        }

        const result = zipcodes.lookup(+zipVal.value);

        if(!result){
            zipHasError.value = true;
            cityState.value = '';
            return;
        }

        cityState.value = `${result.city}, ${result.state}, ${result.country}`;

    }

    const sanitizeBio = (value) => {

        let sanitized = sanitizeHTML(value, {
            allowedTags: ['b', 'strong', 'u', 'i', 'em', 'br', 'a', 'h1', 'h2', 'h3', 'h4', 'ol', 'ul', 'li', 'p'], 
            allowedAtrributes: {
                'a': ['href']
            }, 
            allowedSchemes: ['http', 'https', 'mailto']
        });
        sanitized = sanitized.replace(/(\<p\>\<br \/\>\<\/p\>){2,}/, '<br>');
        sanitized = sanitized.trim();
        return sanitized;

    }


    const validateBio = () => {

        let stripped = sanitizeHTML(bioContent.value, {
            allowedTags: []
        })
        let valToCheck = htmlEntitiesDecode(stripped);

        console.log(valToCheck);

        if(stringLength(valToCheck) > 3000){
            submissionErrors.push('Bio is too long.');
            return false;
        }

        return true;

    }

    const validate = () => {

        submissionErrors.splice(0,submissionErrors.length);

        let isValid = true;

        if(!validateBio()){
            isValid = false;
        };

        if(zipHasError.value === true){
            isValid = false;
            submissionErrors.push('Invalid zip code');
        }

        return isValid;


    }

    const submit = async () => {

        if(!validate()){
            return;
        }

        try{ 

            await axios.patch('http://localhost:3001/api/v1/edit-profile', {
                bio: sanitizeBio(bioContent.value), 
                gender: genderVal.value.toLowerCase() || 'not specified', 
                occupation: occVal.value || '', 
                location: cityState.value || ''
            }, 
            {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            });

            openFlashToast(MessageTypes.SUCCESS, 'Profile updated!');

        }catch(e){
            console.error(e);
        }

    }

    const capitalize = (value: string) => {
        const splitted = value.split('');
        splitted[0] = splitted[0].toUpperCase();
        return splitted.join('');
    }

    const fetchProfileData = async () => {

        try{

            const response = await axios.get(`http://localhost:3001/api/v1/profile/member/${getUserData.username}`, {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            })

            const { gender, bio, occupation } = response.data.body;

            bioContent.value = bio;
            genderVal.value = gender === 'not specified' ? '' : capitalize(gender);
            occVal.value = occupation || '';
            quill.value.setHTML(bioContent.value);

        }catch(e){
            console.error(e);

        }
        
    }

    onMounted(() => {
        fetchProfileData();
    });



</script>

<style lang="scss" scoped>

    .container{
        width:60%;
        margin:2rem auto;
        padding:1rem;
    }

    .edit-profile-image-area{
        padding:2rem;
        margin-bottom:2rem;
        background:#fff;
        box-shadow: 0 0 .25rem rgba(0,0,0,.24);
        display:flex;
        flex-direction:column;
        align-items:center;
    }

    .current-profile-image{
        width:12rem;
        height:12rem;
        border-radius:90%;
        margin-bottom:2rem;
    }

    .edit-profile-form{
        background:#fff;
        box-shadow: 0 0 .25rem rgba(0,0,0,.24);
        padding:2rem;
        font-size:1.6rem;
    }

    .fgrp{
        margin:2rem 0;
    }

    .bio-textarea{
        display:block;
        height:10rem;
        width:100%;
        resize:none;
        padding:3px;
    }

    label{
        display:block;
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


    @media (max-width: 750px) {

        .container{
            width:100%;
        }

    }
</style>