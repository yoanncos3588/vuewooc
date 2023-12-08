<script setup lang="ts">
import Title from "../components/Title.vue";
import "vue3-carousel/dist/carousel.css";
import CarouselFeatured from "../components/CarouselFeatured.vue";
</script>

<template>
  <section>
    <Title level="h2" size="2" text="À la une" />
    <CarouselFeatured />
  </section>
</template>
