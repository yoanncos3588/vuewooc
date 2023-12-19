<script setup lang="ts">
import { computed } from "vue";
import ProductPrice from "./ProductPrice.vue";
import Title from "./Title.vue";
import Tag from "./Tag.vue";
import ProductImage from "./ProductImage.vue";
import TextClamp from "vue3-text-clamp";
import { stripHTMLFromString } from "../utils/formatText";
import { useCatalog } from "../store/catalog";

const props = defineProps<{
  id: number;
}>();

const storeCatalog = useCatalog();

const product = storeCatalog.products.get(props.id);

const description = computed(() => (product && product.shortDescription ? stripHTMLFromString(product.shortDescription) : ""));
const hasVariations = computed(() => Boolean(product?.variations.length));
</script>

<template>
  <article class="card card-product" v-if="product">
    <div class="card-image">
      <RouterLink :to="`/product/${product.slug}/${product.id}`">
        <div class="card-product__sale" v-show="product.onSale">
          <Tag color="danger" text="promo" />
        </div>
        <!-- <figure class="image is-square" v-if="product.images.length">
          <img :src="product.images[0].src" :alt="`Image of ${product.name}`" />
        </figure> -->
        <ProductImage :images="product.images" />
      </RouterLink>
    </div>
    <div class="card-content card-product__content">
      <div class="card-product__title mb-4">
        <RouterLink :to="`/product/${product.slug}/${product.id}`">
          <Title :text="product.name" level="h2" size="5" />
        </RouterLink>
      </div>
      <p class="card-product__description">
        <TextClamp :max-lines="2" :text="description"></TextClamp>
      </p>
      <div class="my-2 card-product__price">
        <ProductPrice :price="!hasVariations ? product.regularPrice : product.price" :salePrice="product.onSale ? product.salePrice : undefined" />
      </div>
    </div>
  </article>
</template>
