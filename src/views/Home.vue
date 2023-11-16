<script setup lang="ts">
import { useCatalog } from "../store/catalog";

const catalogStore = useCatalog();

const res = catalogStore.fetchProductsByCategory(18);
</script>

<template>homepage</template>
