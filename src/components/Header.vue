<script setup lang="ts">
import { useUser } from "../store/user";
import Button from "./Button.vue";
import Dropdown from "./Dropdown.vue";

const userStore = useUser();
</script>

<template>
  <header>
    <div class="navbar is-light is-spaced">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item has-text-weight-bold is-uppercase is-size-4 has-text-info">
          <span class="has-text-primary">Vue</span>Wooc
        </RouterLink>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="$emit('toggleBurger')">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <form>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input type="text" class="input" placeholder="Rechercher un produit" />
              </div>
              <div class="control">
                <RouterLink to="/search" class="button is-primary">
                  <span class="icon is-small">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                </RouterLink>
              </div>
            </div>
          </form>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <Dropdown id="auth-button" v-if="userStore.isUserConnected">
                <template v-slot:trigger>
                  <Button label="connexion / inscription" icon="fa-angle-down" :aria="{ 'aria-controls': 'auth-button' }" />
                </template>
                <template v-slot:content>
                  <div class="dropdown-item">
                    <span class="has-text-weight-bold is-block">Déjà client ?</span>
                    <Button label="Se connecter" link="/login" />
                  </div>
                  <hr class="dropdown-divider" />
                  <div class="dropdown-item">
                    <span class="has-text-weight-bold is-block">Nouveau client ?</span>
                    <Button label="S'inscrire" link="/signup" />
                  </div>
                </template>
              </Dropdown>
              <Dropdown id="show-user-menu" v-else>
                <template v-slot:trigger>
                  <Button label="mon compte" icon="fa-angle-down" :aria="{ 'aria-controls': 'show-user-menu' }"></Button>
                </template>
                <template v-slot:content>
                  <div class="dropdown-item">
                    <RouterLink to="#">Mes informations</RouterLink>
                  </div>
                  <hr class="dropdown-divider" />
                  <div class="dropdown-item">
                    <RouterLink to="#">Mes commandes</RouterLink>
                  </div>
                </template>
              </Dropdown>
              <Button color="white" to="/cart" icon="fa-solid fa-cart-shopping" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="has-background-info py-2 section is-hidden-touch">
      <nav class="is-flex buttons">
        <Button to="/" color="info" label="Menu 1" bold />
        <Button to="/" color="info" label="Menu 2" bold />
        <Button to="/" color="info" label="Menu 3" bold />
      </nav>
    </div>
  </header>
</template>
