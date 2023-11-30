<script setup lang="ts">
import { computed } from "vue";
import { Colors } from "../types/colors";

const props = defineProps<{
  color?: Colors;
  text: string;
}>();

const cssClass = computed(() => `is-${props.color ? props.color : "info"}`);
</script>
<template>
  <span class="tag" :class="cssClass">{{ text }}</span>
</template>
