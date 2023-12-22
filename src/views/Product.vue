<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
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
import Alert from "../components/Alert.vue";
import { ProductVariation } from "../types/products";

const router = useRouter();
const route = useRoute();
const catalogStore = useCatalog();

const selectedVariation = ref<ProductVariation | undefined>(undefined);
const quantity = ref(1);
const loading = ref(false);
const selectedAttributes = reactive<{ [key: string]: string }>({});

const product = computed(() => catalogStore.products.get(Number(route.params.id)));
const hasVariation = computed(() => (product.value && product.value.variations.length > 1 ? true : false));
const noVariationFoundForAttributes = computed(() => hasVariation.value && selectedVariation.value === undefined);
const description = computed(() =>
  selectedVariation.value
    ? DOMPurify.sanitize(selectedVariation.value.description)
    : product.value?.description
    ? DOMPurify.sanitize(product.value.description)
    : ""
);
const image = computed(() => (selectedVariation.value ? [selectedVariation.value.image] : product.value ? product.value.images : []));

watch(selectedAttributes, () => {
  if (product.value?.variations) {
    selectedVariation.value = catalogStore.getVariationByAttributes(selectedAttributes, product.value.variations);
  }
});

watch(
  () => route.params.id,
  async () => {
    loading.value = true;
    const id = Number(route.params.id);
    if (!catalogStore.products.get(id)) {
      // product was not loaded in store
      await catalogStore.getProductById(id);
      if (!catalogStore.products.get(id)) {
        router.push("/404");
      }
    }
    if (product.value && hasVariation.value) {
      // product is variable, fetch all the variation because filtering by attribute is not possible for variations...
      await catalogStore.getVariations(product.value.id);
      //get first variation to have an active variation
      selectedVariation.value = catalogStore.variations.get(product.value.variations[0]);
      // clear previous attributes
      Object.keys(selectedAttributes).forEach((key) => delete selectedAttributes[key]);
      if (selectedVariation.value) {
        for (const attribute of selectedVariation.value.attributes) {
          // set default value from the first variation
          selectedAttributes[attribute.id] = attribute.option;
        }
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
        <template v-if="description">
          <div class="content" v-html="description"></div>
          <hr />
        </template>
        <p class="is-size-4">
          <ProductPrice :productId="product.id" :variationId="selectedVariation?.id" />
        </p>
        <hr />
        <div class="columns is-multiline">
          <div class="column is-3" v-for="attribute in product.attributes">
            <Select :id="String(attribute.id)" :key="attribute.id" :label="attribute.name" v-model="selectedAttributes[attribute.id]">
              <option v-for="(option, index) in attribute.options" :value="option" :key="index" :selected="selectedAttributes[attribute.id] === option">
                {{ option }}
              </option>
            </Select>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-3-desktop">
            <TextInput label="Quantité" type="number" id="setQuantity" v-model="quantity" />
          </div>
          <div class="column">
            <div class="is-flex is-align-items-end" style="height: 100%">
              <Button label="Add to cart" icon="fa-solid fa-cart-plus" :disabled="noVariationFoundForAttributes" color="success" />
            </div>
          </div>
        </div>
        <div><Alert message="This product is not available" level="danger" v-show="noVariationFoundForAttributes" /></div>
      </div>
    </div>
  </article>
  <Loading v-else />
  <RouterLink to="/product/hoodie-with-zipper/30">Link test</RouterLink>
  <RouterLink to="/product/hoodie-with-logo/23">Link test 2</RouterLink>
</template>
