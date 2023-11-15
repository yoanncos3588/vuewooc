<script setup lang="ts">
import { useCatalog } from "../store/catalog";

const catalogStore = useCatalog();

const res = catalogStore.fetchCategories();

console.log(import.meta.env.VITE_CONSUMER_KEY);
console.log(res);
</script>

<template>homepage</template>
