<template>
    <div :class="['textual-input', {'error': error}]">
        <input 
        :type="inputType" 
        class="textual-input__field" 
        placeholder=" "
        :maxlength="maxLength"
        :max="max"
        :disabled="disabled"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        autocapitalize="off"
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
                return ['text', 'number', 'password','email','url','tel','search'].includes(value);
            }
        }, 
        label: {
            type: String, 
            required: true
        }, 
        maxLength: {
            type: String, 
            default: "100"
        }, 
        max: {
            type: String
        },
        disabled: {
            type: Boolean, 
            default: false
        }, 
        error: {
            type: Boolean, 
            default: false
        },
        modelValue: String
    });

    const emit = defineEmits(['update:modelValue']);

</script>

<style lang="scss" scoped>

    .textual-input{
        border:1px solid #ddd;
        border-radius:5px;
        position:relative;
        height:4.5rem;
        transition:border .3s;
        background:#fff;

        &.error, 
        &:focus-within.error{
            border:1px solid red;
        }

        &:focus-within{
            border:1px solid #2982b3;
        }

        &__field{
            display:block;
            font-size:1.7rem;
            width:calc(100% - 3px);
            position:absolute;
            bottom:3px;
            left:3px;
            border:none;
            outline:none;
            color:#35495E;

            &:focus + .textual-input__label, 
            &:not(:placeholder-shown) + .textual-input__label {
                font-size:1.2rem;
                transform:translateY(-2.4rem);
            }

        }

        &__label{
            display:block;
            font-size:2rem;
            position:absolute;
            bottom:0;
            left:3px;
            color:#ADADAD;
            pointer-events:none;
            transition:all .3s;
        }
    }

</style>