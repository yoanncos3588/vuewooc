<script setup lang="ts">
import Title from "../components/Title.vue";
import { useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import { computed, ref, watch } from "vue";
import { sameParams } from "../utils/compare";
import { UrlParams } from "../types/apiParams";
import { ProductCategorie } from "../types/categories";
import ProductsList from "../components/ProductsList.vue";

const route = useRoute();
const router = useRouter();
const catalogStore = useCatalog();

const category = ref<ProductCategorie | undefined>(undefined);
const products = computed(() => catalogStore.getProductsByCategory(getSlug(route.params.slug)));

/**
 * watch slug in url and use last for subcategories
 * */
watch(
  () => route.params.slug,
  async () => {
    getProducts();
  },
  {
    immediate: true,
  }
);

async function getProducts() {
  console.log("getprod");
  category.value = catalogStore.getCategoryBySlug(getSlug(route.params.slug));
  if (category.value) {
    const param: UrlParams = { category: category.value.id };
    if (!sameParams(catalogStore.paramsHistory, param)) {
      // fetch products if query is not in history
      await catalogStore.fetchProducts(param);
    }
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
      <ProductsList :products="products" />
    </div>
  </section>
</template>
