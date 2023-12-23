<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { UrlParams } from "../types/apiParams";
import { Product } from "../types/products";
import { useCatalog } from "../store/catalog";
import ProductsList from "../components/ProductsList.vue";
import Loading from "../components/Loading.vue";
import Pagination from "../components/Pagination.vue";

const props = defineProps<{
  queryParams: UrlParams;
}>();

const catalogStore = useCatalog();

const products = ref<Product[]>([]);
const totalPages = ref<number>(1);
const totalProducts = ref<number>(0);
const isLoading = ref(false);

const showNavigation = computed(() => totalPages.value > 1);

/** watch if props is updated */
watch(
  () => props.queryParams,
  async () => {
    await getProducts(props.queryParams);
  },
  { immediate: true, deep: true }
);

/**
 * call api to get products
 * @param queryParams
 */
async function getProducts(queryParams: UrlParams = {}) {
  isLoading.value = true;
  const resProducts = await catalogStore.getProducts(queryParams);
  products.value = resProducts.products;
  totalPages.value = resProducts.totalPages;
  totalProducts.value = resProducts.totalProducts;
  isLoading.value = false;
}
</script>

<template>
  <template v-if="!isLoading">
    <div class="mb-5">
      <hr />
      <p class="is-size-7 has-text-grey-light">{{ totalProducts }} product(s) found</p>
    </div>
    <Pagination :totalPages="totalPages" v-if="showNavigation" :addToUrl="true" />
    <ProductsList :products="products" />
    <Pagination :totalPages="totalPages" v-if="showNavigation" :addToUrl="true" />
  </template>
  <template v-else> <Loading /> </template>
</template>
