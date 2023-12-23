<script setup lang="ts">
import { useCatalog } from "../store/catalog";
import ProductsList from "../components/ProductsList.vue";
import { computed } from "vue";

const props = defineProps<{
  productIds: number[];
}>();

const catalogStore = useCatalog();
const productsToFetch = [];

for (const id of props.productIds) {
  if (!catalogStore.products.get(id)) {
    productsToFetch.push(id);
  }
}

if (productsToFetch.length >= 1) {
  await catalogStore.getProducts({ include: JSON.stringify(productsToFetch), per_page: productsToFetch.length });
}

const products = computed(() => {
  let productsList = [];
  for (const id of props.productIds) {
    const product = catalogStore.products.get(id);
    if (product) {
      productsList.push(product);
    }
  }
  return productsList;
});
</script>

<template>
  <ProductsList :products="products" />
</template>
