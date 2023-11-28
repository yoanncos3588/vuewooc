<script setup lang="ts">
import { computed } from "vue";
import { Colors } from "../types/colors";
import Icon from "./Icon.vue";

interface Arias {
  [key: string]: string;
}
const props = defineProps<{
  to?: string;
  aria?: Arias;
  label?: string;
  icon?: string;
  disabled?: boolean;
  color?: Colors;
  loading?: boolean;
  type?: "submit" | "reset" | "button";
  bold?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const cssClass = computed(() => {
  let value = "";
  value += props.color ? `is-${props.color} ` : "";
  value += props.loading ? `is-loading ` : "";
  value += props.bold ? `has-text-weight-bold ` : "";
  return value;
});
const htmlTag = computed(() => (props.to ? "router-link" : "button"));

function click() {
  if (!props.to) {
    emit("click");
  }
}
</script>

<template>
  <component :is="htmlTag" :to="to" class="button" :class="cssClass" v-bind="aria" @onclick="click">
    <span v-if="label">
      {{ label }}
    </span>
    <Icon :class="icon" v-if="icon" />
  </component>
</template>
