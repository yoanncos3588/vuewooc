<script setup lang="ts">
import { watch } from "vue";
import Drawer from "./components/Drawer.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Loading from "./components/Loading.vue";
import { useRoute } from "vue-router";
import { useMenus } from "./store/menus";

const route = useRoute();

const menuStore = useMenus();

function toggleBurger() {
  menuStore.toggleDrawer();
}

watch(
  () => route.path,
  () => {
    menuStore.closeDrawer();
  }
);
</script>

<template>
  <Drawer @toggleBurger="toggleBurger" />
  <Header @toggleBurger="toggleBurger" />
  <main class="my-5 px-5">
    <div class="container">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Suspense :timeout="0">
            <component :is="Component"></component>
            <template #fallback>
              <Loading />
            </template>
          </Suspense>
        </template>
      </RouterView>
    </div>
  </main>
  <Footer />
</template>

<style scoped></style>
