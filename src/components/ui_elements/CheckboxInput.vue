<template> 
    <label class="checkbox-input" :for="inputId">
        <div class="checkbox-input__box">
            <i class="fa fa-check"></i>
        </div>
        <input 
        type="checkbox" 
        class="checkbox-input__field" 
        :id="inputId" 
        :value="modelValue", 
        @input="$emit('update:modelValue', $event.target.value)"
        />
        <div class="checkbox-input__label-text">{{ label }}</div>
    </label>
</template>

<script lang="ts" setup>
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        inputId: {
            type: Number, 
            required: true
        }, 
        label: {
            type: String, 
            default: '[LABEL]'
        }, 
        modelValue: String
    });


    const emit = defineEmits(['update:modelValue']);

</script>