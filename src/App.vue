<script setup lang="ts">
import { ref } from "vue";
import Drawer from "./components/Drawer.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const isDrawerOpen = ref(false);

function toggleBurger() {
  isDrawerOpen.value = !isDrawerOpen.value;
}
</script>

<template>
  <Drawer :isDrawerOpen="isDrawerOpen" @toggleBurger="toggleBurger" />
  <Header @toggleBurger="toggleBurger" />
  <main class="my-5 px-5">
    <div class="container">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Suspense>
            <component :is="Component"></component>
            <template #fallback>
              <progress class="progress is-small" max="100">15%</progress>
            </template>
          </Suspense>
        </template>
      </RouterView>
    </div>
  </main>
  <Footer />
</template>

<style scoped></style>
