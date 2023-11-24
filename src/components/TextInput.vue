<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  modelValue: string;
  type: string;
  label: string;
  id: string;
  placeholder?: string;
  icon?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const firstFocus = ref(true);
const cssHasIconsClass = computed(() => {
  return `${props.icon ? "has-icons-left" : ""}`;
});

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);
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
      <span class="icon is-small is-left" v-if="icon">
        <i class="fas" :class="icon"></i>
      </span>
    </div>
    <p class="help is-danger" v-if="error && !firstFocus">{{ error }}</p>
  </div>
</template>
