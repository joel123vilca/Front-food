<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

// Props para configurar el componente
const props = defineProps({
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  modelValue: String, // Prop para soportar v-model
});

// Emitir eventos al padre
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="mb-4">
    <label class="mb-2.5 block font-medium text-black dark:text-white">
      {{ props.label }}
    </label>
    <div class="relative">
      <input
        :type="props.type"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        @input="
          (event) => {
            if (event.target) {
              emit('update:modelValue', event.target.value);
            }
          }
        "
        class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-black dark:text-white"
      />

      <span class="absolute right-4 top-4">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
