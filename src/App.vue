<script setup lang="ts">
import { ref } from "vue";
import Drawer from "./components/Drawer.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useMenus } from "./store/menus";

const menusStore = useMenus();

const isDrawerOpen = ref(false);

function toggleBurger() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

if (!menusStore.mainMenu) {
  menusStore.fetchMenu(40);
}
</script>

<template>
  <Drawer :isDrawerOpen="isDrawerOpen" @toggleBurger="toggleBurger" />
  <Header @toggleBurger="toggleBurger" />
  <main class="my-5 px-5">
    <div class="container">
      <RouterView />
    </div>
  </main>
  <Footer />
</template>

<style scoped></style>
