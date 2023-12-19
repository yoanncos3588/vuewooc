<script setup lang="ts">
import { computed } from "vue";
import { useCatalog } from "../store/catalog";

const props = defineProps<{
  productId: number;
}>();

const catalogStore = useCatalog();

const product = computed(() => catalogStore.products.get(props.productId));
const normalPriceToShow = computed(() => (!product.value?.variations.length ? product.value?.regularPrice : product.value.price));
const variableProduct = computed(() => (product.value ? product.value.variations.length > 0 : false));
</script>

<template>
  <template v-if="product">
    <span v-show="product.onSale && !variableProduct">
      <b> {{ product.salePrice }} € </b>
    </span>
    <span :class="{ 'ml-2': product.onSale && !variableProduct }">
      <component :is="product.onSale && !variableProduct && normalPriceToShow ? 's' : 'b'">{{ normalPriceToShow }} €</component>
    </span>
  </template>
</template>
