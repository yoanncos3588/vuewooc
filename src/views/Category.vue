<script setup lang="ts">
import Title from "../components/Title.vue";
import { useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, reactive, ref, watch, watchEffect } from "vue";
import { UrlParams } from "../types/apiParams";
import { ProductCategorie } from "../types/categories";
import ProductsList from "../components/ProductsList.vue";
import Loading from "../components/Loading.vue";
import api from "../modules/api/api";
import { Product } from "../types/products";
import Pagination from "../components/Pagination.vue";
import OrderBy, { orderByOptions } from "../components/OrderBy.vue";
import Slider from "@vueform/slider";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalog();

const products = ref<Product[]>([]);
const category = ref<ProductCategorie | undefined>(catalogStore.getCategoryBySlug(getSlug(route.params.slug)));
const totalPages = ref<number>(1);
const currentPage = ref<number>(1);
const isLoading = ref(false);
const orderBy = ref("date");
const priceRange = ref([20, 40]);
const onlySales = ref(false);
const needToResetPagination = ref(false);

watch(onlySales, () => (needToResetPagination.value = true));

const orderByCase: orderByOptions[] = [
  { value: "date?order=asc", label: "Date" },
  { value: "title?order=asc", label: "Name (a - z)" },
  { value: "title?order=desc", label: "Name (z - a)" },
  { value: "price?order=asc", label: "Price (Increasing)" },
  { value: "price?order=desc", label: "Price (Decreasing)" },
];

const showNavigation = computed(() => totalPages.value > 1);
const fetchParams = computed((): UrlParams => {
  // api request parameters builder,
  // this computed variable is watched to call api if something change
  const params: UrlParams = {};
  if (category.value) {
    params.category = category.value.id;
  }
  if (currentPage.value > 1) {
    if (currentPage.value > 1 && onlySales.value && needToResetPagination.value) {
      currentPage.value = 1;
      needToResetPagination.value = false;
      return {};
    }
    params.page = currentPage.value;
  }
  if (orderBy.value.includes("?order=asc")) {
    params.order = "asc";
    params.orderby = orderBy.value.replace("?order=asc", "");
  }
  if (orderBy.value.includes("?order=desc")) {
    params.order = "desc";
    params.orderby = orderBy.value.replace("?order=desc", "");
  }
  if (onlySales.value) {
    params.on_sale = true;
  }
  return params;
});

/** watch currentPage */
watch(currentPage, () => {
  // if current page change we add this location to the nav history,
  // currentPage can change from inter navigation or raw url modification
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

/**
 * call api to get products
 * @param queryParams use empty queryParams object to prevent an api call (ex: need to reset page number when data is filtered)
 */
async function getProducts(queryParams: UrlParams = {}) {
  if (!Object.keys(queryParams).length) {
    // usefull to cancel a query
    return;
  }
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
      <div class="columns mb-5">
        <div class="column is-3-desktop">
          <OrderBy v-model="orderBy" :orderByCase="orderByCase" />
        </div>
        <div class="column is-3-desktop is-offset-1-desktop">
          <div class="category-filter__item category-filter__item--prices">
            <label class="category-filter__label label">Price range</label>
            <div>
              <Slider v-model="priceRange" tooltipPosition="bottom" />
            </div>
          </div>
        </div>
        <div class="column is-2-desktop is-offset-1-desktop">
          <div class="category-filter is-flex is-align-items-center">
            <div class="category-filter__item category-filter__item--sales">
              <p class="label">Filtrer</p>
              <label class="checkbox"> <input type="checkbox" :value="onlySales" v-model="onlySales" /> Sales only </label>
            </div>
          </div>
        </div>
      </div>
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

<style src="@vueform/slider/themes/default.css"></style>
