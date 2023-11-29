<script setup lang="ts">
import { useMenus } from "../store/menus";
import Button from "./Button.vue";
import Dropdown from "./Dropdown.vue";

defineProps<{
  class?: string;
  inDrawer?: boolean;
}>();

const menusStore = useMenus();
</script>

<template>
  <ul :class="class" v-if="menusStore.mainMenu">
    <template v-for="menu of menusStore.mainMenu">
      <li>
        <!-- menu desktop -->
        <template v-if="!inDrawer">
          <Button :to="menu.url" :label="menu.title.rendered" bold v-if="menu.childrens.length === 0" color="info" />
          <Dropdown :id="`menu-${menu.id}`" v-else>
            <template v-slot:trigger>
              <Button :label="menu.title.rendered" bold color="info" icon="fa-angle-down" />
            </template>
            <template v-slot:content>
              <template v-for="(menuChildren, index) in menu.childrens">
                <div class="dropdown-item">
                  <RouterLink :to="menuChildren.url">{{ menuChildren.title.rendered }} </RouterLink>
                </div>
                <hr class="dropdown-divider" v-show="index !== menu.childrens.length - 1" />
              </template>
            </template>
          </Dropdown>
        </template>
        <!-- menu drawer -->
        <template v-else>
          <RouterLink :to="menu.url">{{ menu.title.rendered }}</RouterLink>
          <ul v-if="menu.childrens.length !== 0">
            <li v-for="menuChildren in menu.childrens">
              <RouterLink :to="menuChildren.url">{{ menuChildren.title.rendered }}</RouterLink>
            </li>
          </ul>
        </template>
      </li>
    </template>
  </ul>
</template>
