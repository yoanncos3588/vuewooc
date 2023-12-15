<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  totalPages: number;
  currentPage: number;
  addToUrl: boolean;
}>();

const route = useRoute();

const disabledPrevious = computed(() => (props.currentPage === 1 ? true : false));
const disabledNext = computed(() => (props.currentPage === props.totalPages ? true : false));
const htmlTag = computed(() => (props.addToUrl ? "router-link" : "a"));

const emit = defineEmits<{
  (event: "update:currentPage", value: number): void;
}>();

function isCurrentPage(index: number): boolean {
  return index === props.currentPage;
}
</script>

<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <component
      :is="htmlTag"
      class="pagination-previous"
      :class="{ 'is-disabled': disabledPrevious }"
      @click="emit('update:currentPage', currentPage - 1)"
      :to="{ name: 'category', query: { ...route.query, page: currentPage - 1 } }"
      >Previous</component
    >
    <component
      :is="htmlTag"
      class="pagination-next"
      :class="{ 'is-disabled': disabledNext }"
      @click="emit('update:currentPage', currentPage + 1)"
      :to="{ name: 'category', query: { ...route.query, page: currentPage + 1 } }"
      >Next</component
    >
    <ul class="pagination-list">
      <li v-for="index in totalPages">
        <a
          class="pagination-link"
          :class="isCurrentPage(index) ? 'is-current' : ''"
          :aria-label="`Page ${index}`"
          :aria-current="isCurrentPage(index) ? 'page' : undefined"
          @click="emit('update:currentPage', index)"
          :to="{ name: 'category', query: { ...route.query, page: index } }"
          >{{ index }}</a
        >
      </li>
    </ul>
  </nav>
</template>
