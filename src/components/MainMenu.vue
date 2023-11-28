<script setup lang="ts">
import { useMenus } from "../store/menus";
import Button from "./Button.vue";
import Dropdown from "./Dropdown.vue";

defineProps<{
  class?: string;
}>();

const menusStore = useMenus();

if (!menusStore.mainMenu) {
  menusStore.fetchMenu(40);
}
</script>

<template>
  <ul :class="class" v-if="menusStore.mainMenu">
    <template v-for="menu of menusStore.mainMenu">
      <li>
        <Button :to="menu.url" :label="menu.title.rendered" bold v-if="!menu.isParent" color="info" />
        <Dropdown :id="`menu-${menu.id}`" v-else>
          <template v-slot:trigger>
            <Button :label="menu.title.rendered" bold color="info" />
          </template>
          <template v-slot:content></template>
        </Dropdown>
      </li>
    </template>
  </ul>
</template>
