<script setup lang="ts">
import { useCatalog } from "../store/catalog";

const catalogStore = useCatalog();

const res1 = catalogStore.fetchProducts();

// const res2 = catalogStore.fetchProductsByCategory(39);
</script>

<template>homepage</template>
