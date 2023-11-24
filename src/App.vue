<script setup lang="ts">
import Header from "./components/Header.vue";
</script>

<template>
  <Header />
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
