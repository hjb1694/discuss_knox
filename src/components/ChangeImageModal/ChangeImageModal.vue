<template>
    <div class="change-image-modal">
        <div class="change-image-modal__backdrop" @click="closeModal"></div>
        <div class="change-image-modal__dialog">
            <header class="change-image-modal__header">
                <h2>Change Profile Image</h2>
                <button class="change-image-modal__close-btn" @click="closeModal">
                    <i class="fa fa-close"></i>
                </button>
            </header>
            <section ref="modalBody" class="change-image-modal__body">
                <label ref="imageUploadLabel" class="image-upload-label">
                    <span>Upload an Image</span>
                    <input ref="imageUploadInput" class="image-upload-input" type="file" accept="image/*" />
                </label>
                <button class="crop-save-btn" ref="cropSaveBtn">Crop and Save</button>
                <button>Use Default Image</button>
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.css';
    import axios from 'axios';
    import { useAuthStore } from '@/stores/useAuthStore';

    const emit = defineEmits(['closeModal']);

    const { getAuthToken } = useAuthStore();

    const imageUploadInput = ref(null);
    const modalBody = ref(null);
    const imageUploadLabel = ref(null);
    const isCropAndSaveBtnShown = ref<boolean>(false);
    const cropSaveBtn = ref(null);

    const closeModal = () => {
        emit('closeModal');
    }

    const updateProfileImage = async (data) => {

        try{

            await axios.patch('http://localhost:3001/api/v1/profile-image', {
                data
            }, {
                headers: {
                    'x-auth-token': getAuthToken.value
                }
            })

            emit('closeModal');

        }catch(e){
            console.error(e);
        }


    }

    onMounted(() => {

        imageUploadInput.value.addEventListener('change', () => {

            const fileReader = new FileReader();
            let cropper = '';

            fileReader.onload = e => {

                if(e.target.result){

                    let img = document.createElement('img');
                    img.id = 'cropper';
                    img.src = e.target.result;

                    modalBody.value.insertAdjacentElement('afterBegin', img);
                    cropper = new Cropper(img, {
                        aspectRatio: 1 / 1,
                        cropBoxResizable: false, 
                        viewMode: 3, 
                        ready(){
                            
                            cropSaveBtn.value.addEventListener('click', () => {

                                let imgData = cropper.getCroppedCanvas({width: 100}).toDataURL();

                                updateProfileImage(imgData);

                            });

                        }
                    });
                    imageUploadLabel.value.style.display = 'none';
                    cropSaveBtn.value.classList.add('show');

                }

            }

            fileReader.readAsDataURL(imageUploadInput.value.files[0]);

        });


    });




</script>

<style lang="scss" scoped>
    .change-image-modal{
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

            button{
                display:block;
                background:#21bf8f;
                border:none;
                padding:.8rem 1.2rem;
                color:#fff;
                font-size:1.6rem;
                font-weight:bold;
                border-radius:.5rem;
                margin:1rem 0;
                width:100%;
            }
        }

        .image-upload-label{
            display:flex;
            justify-content:center;
            align-items:center;
            height:10rem;
            width:100%;
            background:#eee;
            border:3px dotted #aaa;
            border-radius:.5rem;
            font-size:2rem;
        }

        .image-upload-input{
            display:none;
        }

        .crop-save-btn{
            display:none;

            &.show{
                display:block;
            }
        }

    }

</style>