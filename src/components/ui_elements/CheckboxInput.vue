<template> 
    <label class="checkbox-input" :for="inputId">
        <input 
        type="checkbox" 
        class="checkbox-input__field" 
        :id="inputId" 
        :value="modelValue"
        @change="checkboxOnChange"
        :checked="modelValue === true"
        />
        <div class="checkbox-input__box">
            <i class="checkbox-input__check fa fa-check"></i>
        </div>
        <div class="checkbox-input__label-text">{{ label }}</div>
    </label>
</template>

<script lang="ts" setup>
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        inputId: {
            type: String, 
            required: true
        }, 
        label: {
            type: String, 
            default: '[LABEL]'
        }, 
        disabled: {
            type: Boolean, 
            default: false
        },
        modelValue: Boolean
    });


    const emit = defineEmits(['update:modelValue']);

    const checkboxOnChange = (e) => {
        emit('update:modelValue', !!e.target.value !== props.modelValue);
    }

</script>

<style lang="scss" scoped>

    .checkbox-input{
        display:flex;
        align-items:center;
        cursor:pointer;

        &__field{
            display:none;

            &:checked ~ .checkbox-input__box {
                background: #35dba9;
            }

            &:checked ~ .checkbox-input__box > .checkbox-input__check {
                display: block;
            }
        }

        &__box{
            margin-right:1rem;
            width:4rem;
            height:4rem;
            border:1px solid #ccc;
            border-radius:5px;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-shrink:0;
        }

        &__check{
            color:#fff;
            font-size:3rem;
            display:none;
        }

        &__label-text{
            font-size:1.6rem;
        }


    }

</style>