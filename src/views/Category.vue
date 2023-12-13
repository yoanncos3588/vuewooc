<script setup lang="ts">
import Title from "../components/Title.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, reactive, ref, toRaw, watch, watchEffect } from "vue";
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
const fetchParams = computed((): UrlParams => {
  const params: UrlParams = {};
  if (category.value) {
    params.category = category.value.id;
  }
  if (currentPage.value > 1) {
    params.page = currentPage.value;
  }
  return params;
});

/** watch currentPage */
watch(currentPage, () => {
  // if current page change we add this location to the nav history,
  // currentPage can change from navigation or url
  router.push({ name: "category", query: { page: currentPage.value } });
});

/** watch route slug */
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

/** watch route query page */
watch(
  () => route.query.page,
  (urlValue) => {
    if (urlValue === undefined || urlValue === null) {
      // add ?page=1 by default to any category page
      router.replace({ name: "category", query: { page: 1 } });
    } else {
      if (Number(urlValue) > totalPages.value) {
        router.push("/404");
      } else {
        // set current page value with the query url value
        currentPage.value = Number(urlValue);
      }
    }
  },
  { immediate: true }
);

watchEffect(() => {
  getProducts(fetchParams.value);
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
        <template v-if="products.length">
          <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" />
          <ProductsList :products="products" />
          <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" />
        </template>
        <template v-else>Aucun produit trouvé</template>
      </template>
      <template v-else> <Loading /> </template>
    </div>
  </section>
</template>
