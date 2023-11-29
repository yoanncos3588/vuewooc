<script setup lang="ts">
import { ProductImages } from "../types/products";
import Title from "./Title.vue";
const props = defineProps<{
  name: string;
  slug: string;
  shortDescription: string;
  priceHtml: string;
  onSale: boolean;
  images: Array<ProductImages>;
}>();
</script>
<template>
  <article class="card">
    <div class="card-image">
      <RouterLink :to="slug">
        <figure class="image is-square">
          <img :src="images[0].src" :alt="`Image du produit ${name}`" />
        </figure>
      </RouterLink>
    </div>
    <div class="card-content">
      <RouterLink :to="slug">
        <Title :text="name" level="h2" size="4" />
      </RouterLink>
      {{ shortDescription }}
    </div>
  </article>
</template>
