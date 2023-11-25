<script setup lang="ts">
import Button from "./Button.vue";
import Dropdown from "./Dropdown.vue";
</script>

<template>
  <header>
    <div class="navbar is-light is-spaced">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item has-text-weight-bold is-uppercase is-size-4 has-text-info">
          <span class="has-text-primary">Vue</span>Wooc
        </RouterLink>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
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
              <Dropdown id="auth-button">
                <template v-slot:trigger>
                  <Button label="connexion / inscription" icon="fa-angle-down" :aria="{ 'aria-controls': 'auth-button' }"></Button>
                </template>
                <template v-slot:content>
                  <div class="dropdown-item">
                    <span class="has-text-weight-bold is-block">Déjà client ?</span>
                    <RouterLink to="/login" class="button is-primary mt-2 is-block">Se connecter</RouterLink>
                  </div>
                  <hr class="dropdown-divider" />
                  <div class="dropdown-item">
                    <span class="has-text-weight-bold is-block">Nouveau client ?</span>
                    <RouterLink to="/signup" class="button is-primary mt-2 is-block">Créer un compte</RouterLink>
                  </div>
                </template>
              </Dropdown>
              <Button color="white" to="/cart" icon="fa-solid fa-cart-shopping" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="has-background-info py-2 section">
      <nav class="is-flex buttons">
        <Button to="/" color="info" label="Menu 1" bold />
        <Button to="/" color="info" label="Menu 2" bold />
        <Button to="/" color="info" label="Menu 3" bold />
      </nav>
    </div>
  </header>
</template>
