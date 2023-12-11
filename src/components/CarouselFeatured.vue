<script setup lang="ts">
import { useCatalog } from "../store/catalog";
import CarouselProducts from "./CarouselProducts.vue";

const catalogStore = useCatalog();
await catalogStore.getProducts({ featured: "true" });
</script>

<template>
  <CarouselProducts :products="catalogStore.getFeaturedProducts" />
</template>
