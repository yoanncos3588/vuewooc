<script setup lang="ts">
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { Product } from "../types/products";
import CardProduct from "./CardProduct.vue";

defineProps<{
  products: Product[];
}>();
</script>

<template>
  <div class="carousel-products">
    <Carousel :items-to-show="5" :wrap-around="true">
      <Slide v-for="product in products" :key="product.id">
        <div class="carousel-products__slide-container">
          <CardProduct
            :id="product.id"
            :name="product.name"
            :slug="product.slug"
            :shortDescription="product.shortDescription"
            :price="product.price"
            :salePrice="product.salePrice"
            :onSale="product.onSale"
            :images="product.images"
          />
        </div>
      </Slide>
      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </div>
</template>
