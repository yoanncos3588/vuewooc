<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useUser } from "../store/user";
import Alert from "./Alert.vue";
import { AlertLevels } from "../types/alert";

const userStore = useUser();

interface Credentials {
  email: string;
  password: string;
}

const credentials: Credentials = reactive({
  email: "",
  password: "",
});
const message = ref("");
const level = ref<AlertLevels>("danger");
const isFormValid = computed(() => credentials.email !== "" || credentials.password !== "");

/**
 * send login
 */
async function handleSubmit() {
  message.value = "";
  if (!isFormValid) {
    return;
  }
  message.value = await userStore.login(credentials.email, credentials.password);

  if (!message.value) {
    level.value = "success";
    message.value = "Connexion réussie, vous allez être redirigé";
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="email" class="form-label">Adresse email</label>
      <input type="email" id="email" placeholder="monadresse@mail.com" class="form-control" v-model="credentials.email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" name="" id="password" class="form-control" v-model="credentials.password" />
    </div>
    <Alert :message="message" :level="level" v-if="message" />
    <button type="submit" class="btn btn-primary" :disabled="!isFormValid">Se connecter</button>
  </form>
</template>
