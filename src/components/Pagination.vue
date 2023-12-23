<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  totalPages: number;
  addToUrl: boolean;
}>();

const route = useRoute();

const currentPage = ref<number>(route.query.page ? Number(route.query.page) : 1);
const disabledPrevious = computed(() => (currentPage.value === 1 ? true : false));
const disabledNext = computed(() => (currentPage.value === props.totalPages ? true : false));
const htmlTag = computed(() => (props.addToUrl ? "router-link" : "a"));

/** watch route query page */
watch(
  () => route.query.page,
  (current) => {
    currentPage.value = current ? Number(current) : 1;
  },
  { immediate: true }
);

function isCurrentPage(index: number): boolean {
  return index === currentPage.value;
}
</script>

<template>
  <nav class="pagination" role="navigation" aria-label="pagination">
    <component
      :is="htmlTag"
      class="pagination-previous"
      :class="{ 'is-disabled': disabledPrevious }"
      :to="{ name: 'category', query: { ...route.query, page: currentPage - 1 } }"
      >Previous</component
    >
    <component
      :is="htmlTag"
      class="pagination-next"
      :class="{ 'is-disabled': disabledNext }"
      :to="{ name: 'category', query: { ...route.query, page: currentPage + 1 } }"
      >Next</component
    >
    <ul class="pagination-list">
      <li v-for="index in totalPages">
        <component
          :is="htmlTag"
          class="pagination-link"
          :class="isCurrentPage(index) ? 'is-current' : ''"
          :aria-label="`Page ${index}`"
          :aria-current="isCurrentPage(index) ? 'page' : undefined"
          :to="{ name: 'category', query: { ...route.query, page: index } }"
          >{{ index }}</component
        >
      </li>
    </ul>
  </nav>
</template>
