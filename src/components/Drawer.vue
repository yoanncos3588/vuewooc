<script setup lang="ts">
import { watch } from "vue";
import MenuMain from "./MenuMain.vue";
import Button from "./Button.vue";
import ButtonLogOut from "./ButtonLogOut.vue";
import { useUser } from "../store/user";
import { useMenus } from "../store/menus";

const userStore = useUser();
const menuStore = useMenus();

watch(() => menuStore.isDrawerOpen, lockScroll);

function lockScroll() {
  if (menuStore.isDrawerOpen) {
    document.body.classList.add("is-clipped");
    document.querySelector("html")?.classList.add("is-clipped");
  } else {
    document.body.classList.remove("is-clipped");
    document.querySelector("html")?.classList.remove("is-clipped");
  }
}
</script>

<template>
  <div class="drawer" :class="{ 'is-visible': menuStore.isDrawerOpen }">
    <div class="drawer-content p-5" :class="{ 'is-visible': menuStore.isDrawerOpen }">
      <div class="drawer-close"><button class="delete is-medium" @click="$emit('toggleBurger')"></button></div>
      <nav class="menu">
        <p class="menu-label">Nos produits</p>

        <MenuMain class="menu-list" inDrawer />
        <template v-show="userStore.isUserConnected">
          <p class="menu-label">Mon compte</p>
          <ul class="menu-list">
            <li><RouterLink to="1">Mes informations</RouterLink></li>
            <li><RouterLink to="1">Mes commandes</RouterLink></li>
          </ul>
        </template>
      </nav>
      <div class="columns mt-4" v-if="!userStore.isUserConnected">
        <div class="column">
          <Button label="Se connecter" to="/login" color="primary" />
        </div>
        <div class="column">
          <Button label="Créer un compte" to="/signup" color="primary" />
        </div>
      </div>
      <div class="columns mt-4" v-if="userStore.isUserConnected">
        <div class="column">
          <ButtonLogOut />
        </div>
      </div>
    </div>
    <div class="modal-background" @click="$emit('toggleBurger')"></div>
  </div>
</template>
