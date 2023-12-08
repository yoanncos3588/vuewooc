<script setup lang="ts">
import { Product } from "../types/products";
import CardProduct from "./CardProduct.vue";

defineProps<{
  products: Array<Product>;
}>();
</script>

<template>
  <ul class="grid-products">
    <li v-for="product in products">
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
