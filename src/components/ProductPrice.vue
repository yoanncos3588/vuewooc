<script setup lang="ts">
import { computed } from "vue";
import { useCatalog } from "../store/catalog";

const props = defineProps<{
  productId: number;
  variationId?: number;
}>();

const catalogStore = useCatalog();
const product = computed(() => catalogStore.products.get(props.productId));
const variation = computed(() => (props.variationId ? catalogStore.variations.get(props.variationId) : undefined));
const regularPrice = computed(() => {
  if (variation.value) {
    return variation.value.regularPrice;
  }
  if (product.value) {
    // a props variationId has not been given meaning we're in the products list
    if (product.value.variations.length > 1) {
      return product.value.price;
    } else {
      return product.value.regularPrice;
    }
  }
});

const salePrice = computed(() => (variation.value ? variation.value.salePrice : product.value ? product.value.salePrice : undefined));

const showSalePrice = computed(() => {
  // product is on sale if one of its variation is on sale
  if (product.value && product.value.onSale) {
    // a props variationId has been given and variation was found
    if (variation.value) {
      if (!variation.value.onSale) {
        return false;
      } else {
        return true;
      }
      // a props variationId has not been given meaning we're in the products list
    } else {
      // product contains variation
      if (product.value.variations.length > 1) {
        return false;
      } else {
        return true;
      }
    }
  } else {
    // product is not onSale and its possibles variations neither
    return false;
  }
});
</script>

<template>
  <template v-if="product">
    <span v-show="showSalePrice">
      <b> {{ salePrice }} € </b>
    </span>
    <span :class="{ 'ml-2': showSalePrice }">
      <component :is="showSalePrice ? 's' : 'b'">{{ regularPrice }} €</component>
    </span>
  </template>
</template>
