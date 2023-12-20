<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCatalog } from "../store/catalog";
import Loading from "../components/Loading.vue";
import Title from "../components/Title.vue";
import ProductImage from "../components/ProductImage.vue";
import DOMPurify from "dompurify";
import ProductPrice from "../components/ProductPrice.vue";
import Select from "../components/Select.vue";
import TextInput from "../components/TextInput.vue";
import Button from "../components/Button.vue";
import { Product, ProductVariation } from "../types/products";
import api from "../modules/api/api";

const router = useRouter();
const route = useRoute();
const catalogStore = useCatalog();

const selectedVariation = ref<ProductVariation | undefined>(undefined);
const quantity = ref(1);
const loading = ref(false);

const product = computed(() => catalogStore.products.get(Number(route.params.id)));
const description = computed(() => (product.value?.description ? DOMPurify.sanitize(product.value?.description) : ""));
const image = computed(() => (selectedVariation.value ? [selectedVariation.value.image] : product.value ? product.value.images : []));

const isProductVariable = product.value ? product.value?.variations.length > 0 : false;

watch(
  () => route.params.id,
  async () => {
    loading.value = true;
    const id = Number(route.params.id);
    if (!catalogStore.products.get(id)) {
      await catalogStore.getProductById(id);
      if (!catalogStore.products.get(id)) {
        router.push("/404");
      }
      if (product.value && product.value?.variations.length > 0) {
        const resVariation = await api.catalog.fetchProductVariationById(product.value.id, product.value.variations[0]);
        selectedVariation.value = resVariation.payload;
      }
    }
    loading.value = false;
  },
  { immediate: true }
);
</script>

<template>
  <article v-if="!loading && product">
    <div class="columns">
      <div class="column is-6-desktop">
        <ProductImage :images="image" />
      </div>
      <div class="column is-6-desktop">
        <Title :text="product.name" level="h1" size="2" />
        <hr />
        <div class="content" v-html="description"></div>
        <hr />
        <p class="is-size-4">
          <ProductPrice :productId="product.id" />
        </p>
        <hr />
        <div class="columns is-multiline">
          <div class="column is-3" v-for="attribute in product.attributes">
            <Select :id="String(attribute.id)" :key="attribute.id" :label="attribute.name">
              <option v-for="(option, index) in attribute.options" :value="index">{{ option }}</option>
            </Select>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-3-desktop">
            <TextInput label="Quantité" type="number" id="setQuantity" v-model="quantity" />
          </div>
          <div class="column">
            <div class="is-flex is-align-items-end" style="height: 100%">
              <Button label="Ajouter au panier" icon="fa-solid fa-cart-plus" color="success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
  <Loading v-else />
  <RouterLink to="/product/hoodie-with-zipper/30">Link test</RouterLink>
  <RouterLink to="/product/hoodie-with-logo/23">Link test 2</RouterLink>
</template>
