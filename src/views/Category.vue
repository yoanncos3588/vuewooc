<script setup lang="ts">
import Title from "../components/Title.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, ref, toRaw, watch, watchEffect } from "vue";
import { UrlParams } from "../types/apiParams";
import { ProductCategorie } from "../types/categories";
import ProductsList from "../components/ProductsList.vue";
import Loading from "../components/Loading.vue";
import api from "../modules/api/api";
import { Product } from "../types/products";
import Pagination from "../components/Pagination.vue";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalog();

const products = ref<Product[]>([]);
const category = ref<ProductCategorie | undefined>(catalogStore.getCategoryBySlug(getSlug(route.params.slug)));
const totalPages = ref<number>(1);
const currentPage = ref<number>(1);
const isLoading = ref(false);

const showNavigation = computed(() => totalPages.value > 1);

const queryParams = computed((): UrlParams => {
  const urlParams: UrlParams = {};
  if (category.value) {
    urlParams.category = category.value.id;
  }
  if (currentPage.value > 1) {
    urlParams.page = currentPage.value;
  }
  return urlParams;
});

/** watch currentPage */
watch(currentPage, () => {
  // if current page change we add this location to the nav history
  router.push({ name: "category", query: { page: currentPage.value } });
});

/** watch slug */
watch(
  () => route.params.slug,
  (newSlug) => {
    category.value = catalogStore.getCategoryBySlug(getSlug(newSlug));
    if (!category.value) {
      router.push("/404");
    }
  },
  { immediate: true }
);

/** watch query page */
watch(
  () => route.query.page,
  (newPage) => {
    if (newPage === undefined || newPage === null) {
      // add ?page=1 by default to any category page
      router.replace({ name: "category", query: { page: 1 } });
    } else {
      // set current page value with the query url value
      currentPage.value = Number(newPage);
    }
  },
  { immediate: true }
);

watch(category, () => {
  if (!category.value) {
    router.push("/404");
  }
});

watchEffect(() => {
  getProducts(queryParams.value);
});

async function getProducts(queryParams: UrlParams = {}) {
  isLoading.value = true;
  const resProducts = await api.catalog.fetchProducts(queryParams);
  if (resProducts.valid && resProducts.payload) {
    products.value = resProducts.payload.products as Product[];
    totalPages.value = Number(resProducts.payload.totalPages);
  }
  isLoading.value = false;
}

/**
 * Get slug from url (only last item)
 * TODO use ID to prevent same slug with subcategories /music/rock == /vynyl/rock
 * @param newSlug
 */
function getSlug(newSlug: Array<string> | string): string {
  return Array.isArray(newSlug) ? newSlug[newSlug.length - 1] : newSlug;
}
</script>

<template>
  <section>
    <div v-if="category !== undefined">
      <Title level="h2" size="2" :text="category.name" />
      <template v-if="!isLoading">
        <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" />
        <ProductsList :products="products" />
        <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" />
      </template>
      <template v-else> <Loading /> </template>
    </div>
  </section>
</template>
