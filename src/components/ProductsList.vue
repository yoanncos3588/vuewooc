<script setup lang="ts">
import { Product } from "../types/products";
import CardProduct from "./CardProduct.vue";

defineProps<{
  products: Array<Product>;
}>();
</script>

<template>
  <ul class="columns is-multiline">
    <li v-for="product in products" class="column is-4-tablet is-3-desktop">
      <CardProduct
        :id="product.id"
        :name="product.name"
        :slug="product.slug"
        :shortDescription="product.description"
        :price="product.price"
        :onSale="product.onSale"
        :images="product.images"
        :salePrice="product.salePrice"
      />
    </li>
  </ul>
</template>
