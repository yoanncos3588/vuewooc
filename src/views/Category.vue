<script setup lang="ts">
import Title from "../components/Title.vue";
import { useRoute } from "vue-router";
import { useCatalog } from "../store/catalog";
import { ref, watch } from "vue";
import { sameParams } from "../utils/compare";
import { UrlParams } from "../types/apiParams";
import { Product } from "../types/products";
import { ProductCategorie } from "../types/categories";

const route = useRoute();
const catalogStore = useCatalog();

const slug = ref<string>("");
const isLoading = ref(true);
const isError = ref(false);
const products = ref<Array<Product> | undefined>(undefined);
const category = ref<ProductCategorie | undefined>(undefined);

/**
 * watch slug in url and use last for subcategories
 * TODO use ID to prevent same slug with subcategories /music/rock == /vynyl/rock
 * */
watch(
  () => route.params.slug,
  (newSlug: Array<string> | string) => {
    if (Array.isArray(newSlug)) {
      slug.value = newSlug[newSlug.length - 1];
    } else {
      slug.value = newSlug;
    }
    category.value = catalogStore.getCategoryBySlug(slug.value);
    getProducts();
  },
  {
    immediate: true,
  }
);

/**
 * load from pinia or from api
 */
async function getProducts() {
  isLoading.value = true;
  if (category.value) {
    const param: UrlParams = { category: category.value.id };
    if (!sameParams(catalogStore.paramsHistory, param)) {
      // new request
      await catalogStore.fetchProducts(param);
    }
    products.value = catalogStore.getProductsByCategory(slug.value);
    isLoading.value = false;
  } else {
    isLoading.value = false;
    isError.value = true;
  }
}
</script>

<template>
  <section>
    <Title level="h2" size="2" text="À la une" />
    <div v-for="prod in products" v-show="!isLoading && !isError">
      {{ prod.id }}
    </div>
  </section>
</template>
