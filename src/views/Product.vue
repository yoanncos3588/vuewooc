<script lang="ts" setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";

const router = useRouter();
const route = useRoute();
const catalogStore = useCatalog();

const product = computed(() => catalogStore.products.get(Number(route.params.id)));

watch(
  () => route.params.id,
  async () => {
    const id = Number(route.params.id);
    if (!catalogStore.products.get(id)) {
      await catalogStore.getProductById(id);
      if (!catalogStore.products.get(id)) {
        router.push("/404");
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <article v-if="product">{{ product.id }} is loaded</article>
  <RouterLink to="/product/hoodie-with-zipper/30">Link test</RouterLink>
  <RouterLink to="/product/hoodie-with-logo/23">Link test 2</RouterLink>
</template>
