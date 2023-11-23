<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  modelValue: string;
  type: string;
  label: string;
  id: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const firstFocus = ref(true);

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}

function handleFocusOut() {
  firstFocus.value = false;
}
</script>

<template>
  <label :for="id" class="form-label">{{ label }}</label>
  <input
    :type="type"
    :id="id"
    :placeholder="placeholder"
    class="form-control"
    :value="modelValue"
    @input="handleInput"
    @focusout="handleFocusOut"
    :class="error && !firstFocus ? `is-invalid` : ``"
  />
  <div class="invalid-feedback" v-if="error">{{ error }}</div>
</template>
