<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  color?: string;
  position?: string;
  class: string;
}>();

const cssClass = computed(() => {
  let value = "";
  value += props.position ? `is-${props.position}` : "";
  return value;
});
</script>

<template>
  <span class="icon is-small" :class="cssClass">
    <i class="fas" :class="class"></i>
  </span>
</template>
