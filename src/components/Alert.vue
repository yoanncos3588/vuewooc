<script lang="ts" setup>
import { AlertLevels } from "../types/alert";

const props = defineProps<{
  message: string;
  level?: AlertLevels;
}>();
</script>

<template>
  <div class="alert" :class="level ? `alert-${level}` : `alert-info`" role="alert">{{ message }}</div>
</template>
