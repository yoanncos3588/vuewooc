<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  id: string;
  label: string;
  modelValue: string;
  error?: boolean;
  errorLabel?: string;
  required?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const firstFocus = ref(true);
const showWarning = computed(() => props.required && !props.modelValue.length && !firstFocus.value);

function handleFocusOut() {
  firstFocus.value = false;
}

function handleSelect(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="field">
    <label :for="id" class="label">{{ label }}</label>
    <div class="control">
      <div class="select is-fullwidth" :class="{ 'is-loading': loading, 'is-danger': showWarning }">
        <select :id="id" @change="handleSelect" @focusout="handleFocusOut">
          <slot></slot>
        </select>
      </div>
    </div>
    <p class="help is-danger" v-if="showWarning">{{ errorLabel }}</p>
  </div>
</template>
