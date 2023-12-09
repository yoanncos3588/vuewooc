<script setup lang="ts">
import Title from "../components/Title.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, ref } from "vue";
import { sameParams } from "../utils/compare";
import { UrlParams } from "../types/apiParams";
import { ProductCategorie } from "../types/categories";
import ProductsList from "../components/ProductsList.vue";
import Loading from "../components/Loading.vue";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalog();

const category = ref<ProductCategorie | undefined>(catalogStore.getCategoryBySlug(getSlug(route.params.slug)));
const isLoading = ref(false);
const products = computed(() => catalogStore.getProductsByCategory(getSlug(route.params.slug)));

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
    const param: UrlParams = { category: category.value.id };
    if (!sameParams(catalogStore.paramsHistory, param)) {
      // fetch products if query is not in history
      await catalogStore.fetchProducts(param);
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
