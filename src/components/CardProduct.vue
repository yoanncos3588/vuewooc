<script setup lang="ts">
import { computed } from "vue";
import { ProductImages } from "../types/products";
import ProductPrice from "./ProductPrice.vue";
import Title from "./Title.vue";
import TextClamp from "vue3-text-clamp";
import { stripHTMLFromString } from "../utils/formatText";

const props = defineProps<{
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  price: string;
  onSale: boolean;
  images: Array<ProductImages>;
  salePrice: string;
}>();

const description = computed(() => stripHTMLFromString(props.shortDescription));
</script>
<template>
  <article class="card card-product">
    <div class="card-image">
      <RouterLink :to="slug">
        <figure class="image is-square">
          <img :src="images[0].src" :alt="`Image du produit ${name}`" />
        </figure>
      </RouterLink>
    </div>
    <div class="card-content card-product__content">
      <div class="card-product__title mb-4">
        <RouterLink :to="slug">
          <Title :text="name" level="h2" size="4" />
        </RouterLink>
      </div>
      <TextClamp :max-lines="2" :text="description"></TextClamp>
      <div class="my-2 card-product__price">
        <ProductPrice :price="price" :onSale="onSale" :salePrice="salePrice" />
      </div>
    </div>
  </article>
</template>
