<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size: "1" | "2" | "3" | "4" | "5";
  iconClass?: string;
  titleClass?: string;
}>();

const cssClass = computed(() => {
  let value = "";
  value += `is-${props.size} `;
  value += props.titleClass ? props.titleClass : "";
  return value;
});
</script>

<template>
  <component class="title" :class="cssClass" :is="level">
    <span class="icon-text" v-if="iconClass">
      <Icon :class="iconClass" />
      <span>{{ text }}</span>
    </span>
    <template v-else>{{ text }}</template>
  </component>
</template>
