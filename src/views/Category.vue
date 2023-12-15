<script setup lang="ts">
import Title from "../components/Title.vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, ref, watch } from "vue";
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
const currentPage = ref<number>(route.query.page ? Number(route.query.page) : 1);
const isLoading = ref(false);
const orderBy = ref<string>(route.query.orderby ? String(route.query.orderby) : "date");

const orderByCase: orderByOptions[] = [
  { value: "date?order=asc", label: "Date" },
  { value: "title?order=asc", label: "Name (a - z)" },
  { value: "title?order=desc", label: "Name (z - a)" },
  { value: "price?order=asc", label: "Price (Increasing)" },
  { value: "price?order=desc", label: "Price (Decreasing)" },
];

const showNavigation = computed(() => totalPages.value > 1);

/** watch orderby */
watch(orderBy, () => {
  console.log("watch orderBy", orderBy.value);
  const orderParams: UrlParams = {};
  orderParams.order = orderBy.value.includes("?order=asc") ? "asc" : "desc";
  orderParams.orderby = orderBy.value.includes("?order=asc") ? orderBy.value.replace("?order=asc", "") : orderBy.value.replace("?order=desc", "");
  router.push({ name: "category", query: { ...route.query, orderby: orderParams.orderby, order: orderParams.order, page: 1 } });
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

/** only triggered when route update not on create */
onBeforeRouteUpdate((to, from, next) => {
  if (to.path !== from.path) {
    // if paths are different it's a new category so reset the current page number
    currentPage.value = 1;
  }
  next();
});

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
              <!-- <Slider v-model="priceRange" tooltipPosition="bottom" /> -->
            </div>
          </div>
        </div>
        <div class="column is-2-desktop is-offset-1-desktop">
          <div class="category-filter is-flex is-align-items-center">
            <div class="category-filter__item category-filter__item--sales">
              <p class="label">Filtrer</p>
              <!-- <label class="checkbox"> <input type="checkbox" :value="onlySales" v-model="onlySales" /> Sales only </label> -->
            </div>
          </div>
        </div>
      </div>
      <template v-if="!isLoading">
        <template v-if="products.length">
          <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" :addToUrl="true" />
          <ProductsList :products="products" />
          <Pagination :totalPages="totalPages" v-model:currentPage="currentPage" v-if="showNavigation" :addToUrl="true" />
        </template>
        <template v-else>Aucun produit trouvé</template>
      </template>
      <template v-else> <Loading /> </template>
    </div>
  </section>
</template>

<style src="@vueform/slider/themes/default.css"></style>
