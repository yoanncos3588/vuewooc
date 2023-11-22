<script setup lang="ts">
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

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}
</script>

<template>
  <label :for="id" class="form-label">{{ label }}</label>
  <input :type="type" :id="id" :placeholder="placeholder" class="form-control" :value="modelValue" @input="handleInput" />
  <div class="invalid-feedback" v-if="error">{{ error }}</div>
</template>
