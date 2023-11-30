<script setup lang="ts">
import { watch } from "vue";
import MenuMain from "./MenuMain.vue";

const props = defineProps<{
  isDrawerOpen: boolean;
}>();

watch(() => props.isDrawerOpen, lockScroll);

function lockScroll() {
  console.log("lockscroll");
  if (props.isDrawerOpen) {
    document.body.classList.add("is-clipped");
    document.querySelector("html")?.classList.add("is-clipped");
  } else {
    document.body.classList.remove("is-clipped");
    document.querySelector("html")?.classList.remove("is-clipped");
  }
}
</script>

<template>
  <div class="drawer" :class="{ 'is-visible': isDrawerOpen }">
    <div class="drawer-content p-5" :class="{ 'is-visible': isDrawerOpen }">
      <div class="drawer-close"><button class="delete is-medium" @click="$emit('toggleBurger')"></button></div>
      <nav class="menu">
        <p class="menu-label">Nos produits</p>

        <MenuMain class="menu-list" inDrawer />
        <p class="menu-label">Mon compte</p>
        <ul class="menu-list">
          <li><RouterLink to="1">Mes informations</RouterLink></li>
          <li><RouterLink to="1">Mes commandes</RouterLink></li>
        </ul>
      </nav>
      <div class="columns mt-4">
        <div class="column">
          <RouterLink to="/login" class="button is-primary is-block">Se connecter</RouterLink>
        </div>
        <div class="column">
          <RouterLink to="/signup" class="button is-primary is-block">Créer un compte</RouterLink>
        </div>
      </div>
    </div>
    <div class="modal-background" @click="$emit('toggleBurger')"></div>
  </div>
</template>
