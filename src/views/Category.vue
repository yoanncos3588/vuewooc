<script setup lang="ts">
import Title from "../components/Title.vue";
import { useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, ref, watch } from "vue";
import { UrlParams } from "../types/apiParams";
import { ProductCategorie } from "../types/categories";
import ProductsList from "../components/ProductsList.vue";
import Loading from "../components/Loading.vue";
import Pagination from "../components/Pagination.vue";
import OrderBy, { orderByOptions } from "../components/OrderBy.vue";
import Slider from "@vueform/slider";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalog();

const maxPriceDefault = 100;
const orderByDefault = "date?order=asc";

const category = ref<ProductCategorie | undefined>(catalogStore.getCategoryBySlug(getSlug(route.params.slug)));
const totalPages = ref<number>(1);
const currentPage = ref<number>(route.query.page ? Number(route.query.page) : 1);
const isLoading = ref(false);
const orderBy = ref<string>(route.query.orderby ? `${route.query.orderby}?order=${route.query.order}` : orderByDefault);
const onlySales = ref(route.query.on_sale ? route.query.on_sale : false);
const priceRange = ref<Array<number>>([
  route.query.min_price ? Number(route.query.min_price) : 0,
  route.query.max_price ? Number(route.query.max_price) : maxPriceDefault,
]);

const orderByCase: orderByOptions[] = [
  { value: orderByDefault, label: "Date" },
  { value: "title?order=asc", label: "Name (a - z)" },
  { value: "title?order=desc", label: "Name (z - a)" },
  { value: "price?order=asc", label: "Price (Increasing)" },
  { value: "price?order=desc", label: "Price (Decreasing)" },
];

const showNavigation = computed(() => totalPages.value > 1);

/** watch price range */
watch(priceRange, () => {
  const min = Number(priceRange.value[0]);
  const max = Number(priceRange.value[1]);
  const queryPriceRange = { min_price: min, max_price: max };
  router.push({ name: "category", query: { ...route.query, ...queryPriceRange, page: 1 } });
});

/** watch orderby */
watch(orderBy, () => {
  const params: UrlParams = {};
  params.order = orderBy.value.includes("?order=asc") ? "asc" : "desc";
  params.orderby = orderBy.value.includes("?order=asc") ? orderBy.value.replace("?order=asc", "") : orderBy.value.replace("?order=desc", "");

  router.push({ name: "category", query: { ...route.query, orderby: params.orderby, order: params.order, page: 1 } });
});

/** watch on sale filter */
watch(onlySales, () => {
  if (onlySales.value) {
    router.push({ name: "category", query: { ...route.query, on_sale: String(onlySales.value), page: 1 } });
  } else {
    const { on_sale, ...oldQuery } = route.query;
    router.push({ name: "category", query: { ...oldQuery, page: 1 } });
  }
});

/** watch route slug (change category) */
watch(
  () => route.params.slug,
  (newSlug, oldSlug) => {
    if (newSlug.toString() === oldSlug?.toString()) {
      // same slug, only query parameters changed do nothing
      return;
    }
    category.value = catalogStore.getCategoryBySlug(getSlug(newSlug));
  },
  { immediate: true }
);

/** watch route query (change filters and order) */
watch(
  () => route.query,
  (nextQuery, prevQuery) => {
    if (!Object.keys(nextQuery).length) {
      // if the new query is empty, it's a new category or direct page load/refresh
      // add the previous filters to the url and set page to 1, then return to trigger this watch again and fetch
      router.replace({ name: "category", query: { ...prevQuery, page: 1 } });
      return;
    }
    syncStateWithQuery();
    if (category.value) {
      getProducts({ category: category.value.id, ...nextQuery });
    } else {
      router.push("/404");
    }
  },
  { immediate: true }
);

/**
 * call api to get products
 * @param queryParams
 */
async function getProducts(queryParams: UrlParams = {}) {
  isLoading.value = true;
  const resProducts = await catalogStore.getProducts(queryParams);
  totalPages.value = resProducts.totalPages;
  isLoading.value = false;
}

/**
 * keep url paramaters and state sync (mostly for back navigation cases)
 */
function syncStateWithQuery() {
  route.query.page ? (currentPage.value = Number(route.query.page)) : 1;
  route.query.orderby ? (orderBy.value = `${route.query.orderby}?order=${route.query.order}`) : (orderBy.value = orderByDefault);
  route.query.min_price ? (priceRange.value[0] = Number(route.query.min_price)) : (priceRange.value[0] = 0);
  route.query.max_price ? (priceRange.value[1] = Number(route.query.max_price)) : (priceRange.value[1] = maxPriceDefault);
  route.query.on_sale ? (onlySales.value = Boolean(route.query.on_sale)) : (onlySales.value = false);
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
              <Slider v-model="priceRange" tooltipPosition="bottom" :max="maxPriceDefault" />
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
        <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" :addToUrl="true" />
        <ProductsList />
        <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" :addToUrl="true" />
      </template>
      <template v-else> <Loading /> </template>
    </div>
  </section>
</template>

<style src="@vueform/slider/themes/default.css"></style>
