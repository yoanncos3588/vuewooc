<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  totalPages: number;
  currentPage: number;
}>();

const disabledPrevious = computed(() => (props.currentPage === 1 ? true : false));
const disabledNext = computed(() => (props.currentPage === props.totalPages ? true : false));

const emit = defineEmits<{
  (event: "update:currentPage", value: number): void;
}>();

function isCurrentPage(index: number): boolean {
  return index === props.currentPage;
}
</script>

<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <a class="pagination-previous" :class="{ 'is-disabled': disabledPrevious }" @click="emit('update:currentPage', currentPage - 1)">Previous</a>
    <a class="pagination-next" :class="{ 'is-disabled': disabledNext }" @click="emit('update:currentPage', currentPage + 1)">Next page</a>
    <ul class="pagination-list">
      <li v-for="index in totalPages">
        <a
          class="pagination-link"
          :class="isCurrentPage(index) ? 'is-current' : ''"
          :aria-label="`Page ${index}`"
          :aria-current="isCurrentPage(index) ? 'page' : undefined"
          @click="emit('update:currentPage', index)"
          >{{ index }}</a
        >
      </li>
    </ul>
  </nav>
</template>
