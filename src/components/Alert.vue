<script lang="ts" setup>
import { AlertLevels } from "../types/alert";

defineProps<{
  message: string;
  level?: AlertLevels;
}>();
</script>

<template>
  <div class="notification is-light" :class="level ? `is-${level}` : `is-info`">
    {{ message }}
  </div>
</template>
