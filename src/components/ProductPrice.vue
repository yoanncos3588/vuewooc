<script setup lang="ts">
defineProps<{
  price: string;
  salePrice?: string;
}>();
</script>
<template>
  <template v-if="salePrice">
    <span>
      <b> {{ salePrice }} € </b>
    </span>
    <span class="ml-2">
      <s>{{ price }} €</s>
    </span>
  </template>
  <template v-else>
    <span>
      <b>{{ price }} €</b>
    </span>
  </template>
</template>
