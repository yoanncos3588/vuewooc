<script setup lang="ts">
import { useCatalog } from "../store/catalog";
import SigninForm from "../components/SigninForm.vue";
import SignupForm from "../components/SignupForm.vue";
const catalogStore = useCatalog();

const res1 = catalogStore.fetchProducts();

// const res2 = catalogStore.fetchProductsByCategory(39);
</script>

<template>
  <!-- <SigninForm /> -->
  <SignupForm />
  <!-- <TestForm /> -->
</template>
