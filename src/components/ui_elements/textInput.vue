<template>
    <div :class="['textual-input', {'error': error}]">
        <input 
        :type="type" 
        class="textual-input__field" 
        placeholder=" "
        :max-length="maxLength"
        :disabled="disabled"
        />
        <label class="textual-input__label">{{ label }}</label>
    </div>
</template>

<script lang="ts" setup>
    import { defineProps, defineEmits } from 'vue';


    const props = defineProps({
        inputType: {
            type: String, 
            default: 'text', 
            validator(value){
                return ['text','password','email','url','tel','search'].includes(value);
            }
        }, 
        label: {
            type: String, 
            required: true
        }, 
        maxLength: {
            type: Number, 
            default: 100
        }, 
        disabled: {
            type: Boolean, 
            default: false
        }, 
        error: {
            type: Boolean, 
            default: false
        }
        modelValue: String
    });

    const emit = defineEmits(['update:modelValue']);

</script>

<style lang="scss" scoped>

    .textual-input{
        border:1px solid #ccc;
        border-radius:5px;
        position:relative;
        height:4.2rem;
        transition:border .3s;

        &.error, 
        &:focus-within.error{
            border:1px solid red;
        }

        &:focus-within{
            border:1px solid #2982b3;
        }

        &__field{
            display:block;
            font-size:2rem;
            width:calc(100% - 3px);
            position:absolute;
            top:12px;
            left:3px;
            border:none;
            outline:none;

            &:focus + .textual-input__label, 
            &:not(:placeholder-shown) + .textual-input__label {
                font-size:1.2rem;
                transform:translateY(-2.2rem);
            }

        }

        &__label{
            display:block;
            font-size:2rem;
            position:absolute;
            bottom:0;
            left:3px;
            color:#555;
            pointer-events:none;
            transition:all .3s;
        }
    }

</style>