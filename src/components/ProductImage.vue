<script setup lang="ts">
import { ref } from "vue";
import { ProductImages } from "../types/products";

const props = defineProps<{
  images: ProductImages[];
}>();

const iterator = ref(0);

let hoverInterval: number | undefined = undefined;

/**
 * image slideshow
 */
function handleMouseEnter() {
  if (props.images.length > 0) {
    hoverInterval = setInterval(() => {
      iterator.value < props.images.length - 1 ? iterator.value++ : (iterator.value = 0);
    }, 500);
  }
}

function handleMouseLeave() {
  if (props.images.length > 0) {
    clearInterval(hoverInterval);
    iterator.value = 0;
  }
}
</script>

<template>
  <figure class="image is-square" v-if="images.length" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <img
      :src="image.src"
      :alt="image.alt"
      v-for="(image, index) in images"
      :key="index"
      style="opacity: 0"
      :style="iterator === index ? { opacity: 1 } : { opacity: 0 }"
    />
  </figure>
</template>
