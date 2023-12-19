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

const router = useRouter();
const route = useRoute();
const catalogStore = useCatalog();

const quantity = ref(1);

const product = computed(() => catalogStore.products.get(Number(route.params.id)));
const description = computed(() => (product.value?.description ? DOMPurify.sanitize(product.value?.description) : ""));

watch(
  () => route.params.id,
  async () => {
    const id = Number(route.params.id);
    if (!catalogStore.products.get(id)) {
      await catalogStore.getProductById(id);
      if (!catalogStore.products.get(id)) {
        router.push("/404");
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <article v-if="product">
    <div class="columns">
      <div class="column is-6-desktop">
        <ProductImage :images="product.images" />
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
