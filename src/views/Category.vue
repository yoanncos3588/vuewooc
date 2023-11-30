<script setup lang="ts">
import Title from "../components/Title.vue";
import { useRoute } from "vue-router";
import { useCatalog } from "../store/catalog";

const route = useRoute();
const catalogStore = useCatalog();

const slug = route.params.slug as string[];
const category = catalogStore.getCategoryBySlug(slug[slug.length - 1]);
console.log("cat", category);
</script>

<template>
  <section>
    <Title level="h2" size="2" text="À la une" />
    <Suspense>
      <template #default>
        <CarouselFeatured />
      </template>
      <template #fallback><progress class="progress is-small" max="100">15%</progress></template>
    </Suspense>
  </section>
</template>
