<script setup lang="ts">
import { Product } from "../types/products";
import CardProduct from "./CardProduct.vue";

defineProps<{
  products: Product[];
}>();
</script>

<template>
  <ul class="columns is-multiline" v-if="products.length">
    <li v-for="product in products" class="column is-4-tablet is-3-desktop" :key="product.id">
      <CardProduct :id="product.id" />
    </li>
  </ul>
  <p v-else>Aucun produit trouvé</p>
</template>
