<script setup lang="ts"></script>

<template>
  <form class="container">
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
</template>
