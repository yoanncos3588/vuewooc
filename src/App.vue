<script setup lang="ts">
import { ref } from "vue";
import Drawer from "./components/Drawer.vue";
import Header from "./components/Header.vue";

const isDrawerOpen = ref(false);

function toggleBurger() {
  isDrawerOpen.value = !isDrawerOpen.value;
}
</script>

<template>
  <Drawer :isDrawerOpen="isDrawerOpen" @toggleBurger="toggleBurger" />
  <Header @toggleBurger="toggleBurger" />
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
