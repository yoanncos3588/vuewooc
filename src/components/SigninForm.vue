<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useUser } from "../store/user";
import Alert from "./Alert.vue";
import { AlertLevels } from "../types/alert";
import TextInput from "./TextInput.vue";
import { isRequired, validate } from "../utils/validateInput";
import Button from "./Button.vue";

const userStore = useUser();

interface Credentials {
  email: string;
  password: string;
}

const credentials: Credentials = reactive({
  email: "",
  password: "",
});
const level = ref<AlertLevels>("danger");
const formResult = ref("");

const emailValid = computed(() => validate(credentials.email, [isRequired]));
const passwordValid = computed(() => validate(credentials.password, [isRequired]));
const formInvalid = computed(() => !emailValid.value.valid || !passwordValid.value.valid);

/**
 * send login
 */
async function handleSubmit() {
  if (formInvalid.value) {
    return;
  }
  formResult.value = await userStore.login(credentials.email, credentials.password);

  if (!formResult.value) {
    level.value = "success";
    formResult.value = "Connexion réussie, vous allez être redirigé";
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <TextInput
      id="email"
      type="email"
      placeholder="monadresse@mail.com"
      v-model="credentials.email"
      label="Adresse email"
      :error="emailValid.error"
      icon="fa-envelope"
    />
    <TextInput id="password" type="password" v-model="credentials.password" label="Mot de passe" :error="passwordValid.error" icon="fa-lock" />
    <Alert :message="formResult" :level="level" v-if="formResult" />
    <Button type="submit" color="primary" label="Se connecter" />
  </form>
</template>
