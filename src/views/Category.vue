<script setup lang="ts">
import Title from "../components/Title.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, ref } from "vue";
import { UrlParams } from "../types/apiParams";
import { ProductCategorie } from "../types/categories";
import ProductsList from "../components/ProductsList.vue";
import Loading from "../components/Loading.vue";
import api from "../modules/api/api";
import { Product } from "../types/products";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalog();

const products = ref<Product[]>([]);
const category = ref<ProductCategorie | undefined>(catalogStore.getCategoryBySlug(getSlug(route.params.slug)));
const isLoading = ref(false);
// const products = computed(() => catalogStore.getProductsByCategory(getSlug(route.params.slug)));

/** triggered when updating route params */
onBeforeRouteUpdate((to) => {
  category.value = catalogStore.getCategoryBySlug(getSlug(to.params.slug));
  if (!category.value) {
    router.push("/404");
  }
  getProducts();
});

async function getProducts() {
  if (category.value) {
    isLoading.value = true;
    const param: UrlParams = { category: category.value.id, page: 1 };
    const resProducts = await api.catalog.fetchProducts(param);
    if (resProducts.valid && resProducts.payload) {
      products.value = resProducts.payload.products as Product[];
    }
    isLoading.value = false;
  } else {
    router.push("/404");
  }
}

/**
 * Get slug from url (only last item)
 * TODO use ID to prevent same slug with subcategories /music/rock == /vynyl/rock
 * @param newSlug
 */
function getSlug(newSlug: Array<string> | string): string {
  return Array.isArray(newSlug) ? newSlug[newSlug.length - 1] : newSlug;
}

await getProducts();
</script>

<template>
  <section>
    <div v-if="category !== undefined">
      <Title level="h2" size="2" :text="category.name" />
      <template v-if="!isLoading"><ProductsList :products="products" /></template>
      <template v-else> <Loading /> </template>
    </div>
  </section>
</template>
