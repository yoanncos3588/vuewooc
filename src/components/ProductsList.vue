<script setup lang="ts">
import { useCatalog } from "../store/catalog";
import CardProduct from "./CardProduct.vue";

const catalogStore = useCatalog();
</script>

<template>
  <ul class="columns is-multiline" v-if="catalogStore.products.size > 0">
    <li v-for="[key, product] in catalogStore.products" class="column is-4-tablet is-3-desktop" :key="key">
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
  <p v-else>Aucun produit trouvé</p>
</template>
