<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUser } from "../store/user";
import Button from "./Button.vue";

const userStore = useUser();
const router = useRouter();

function logoutAndRedirect() {
  userStore.logout();
  router.push("/");
}
</script>

<template>
  <Button label="Se déconnecter" @click="logoutAndRedirect" />
</template>
