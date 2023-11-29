<script setup lang="ts">
import { useCatalog } from "../store/catalog";
import Title from "../components/Title.vue";
import "vue3-carousel/dist/carousel.css";
import Carousel from "../components/Carousel.vue";
import { onMounted } from "vue";
import CarouselProducts from "../components/CarouselProducts.vue";

const catalogStore = useCatalog();

onMounted(async () => {
  await catalogStore.fetchProducts({ featured: "true" });
});
</script>

<template>
  <section>
    <Title level="h2" size="2" text="À la une" />
    <CarouselProducts :products="catalogStore.getFeaturedProducts" />
  </section>
</template>
