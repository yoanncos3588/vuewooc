<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div class="dropdown is-hoverable">
    <div class="dropdown-trigger">
      <slot name="trigger"></slot>
    </div>
    <div class="dropdown-menu" :id="id" role="menu">
      <div class="dropdown-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
