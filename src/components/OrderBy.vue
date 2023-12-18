<script setup lang="ts">
import { ref, watch } from "vue";
import Select from "./Select.vue";

export type orderByOptions = {
  [key: string]: string;
};

const props = defineProps<{
  modelValue: string;
  orderByCase: orderByOptions[];
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const propsModelValue = ref(props.modelValue);

watch(propsModelValue, () => {
  emit("update:modelValue", propsModelValue.value);
});
</script>

<template>
  <Select id="orderBy" label="Order By" v-model="propsModelValue" :required="true">
    <option v-for="(option, index) in orderByCase" :value="option.value" :selected="option.value === modelValue" :key="index">{{ option.label }}</option>
  </Select>
</template>
