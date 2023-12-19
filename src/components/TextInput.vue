<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";

const props = defineProps<{
  modelValue: string | number;
  type: string;
  label: string;
  id: string;
  placeholder?: string;
  icon?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string | number): void;
}>();

const firstFocus = ref(true);

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  if (props.type === "number") {
    emit("update:modelValue", Number(value));
  } else {
    emit("update:modelValue", value);
  }
}

function handleFocusOut() {
  firstFocus.value = false;
}
</script>

<template>
  <div class="field">
    <label :for="id" class="label">{{ label }}</label>
    <div class="control" :class="{ 'has-icons-left': icon }">
      <input
        :type="type"
        :id="id"
        :placeholder="placeholder"
        class="input"
        :value="modelValue"
        @input="handleInput"
        @focusout="handleFocusOut"
        :class="error && !firstFocus ? `is-danger` : ``"
      />
      <Icon :class="icon" position="left" v-if="icon" />
    </div>
    <p class="help is-danger" v-if="error && !firstFocus">{{ error }}</p>
  </div>
</template>
