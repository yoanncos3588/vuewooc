<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useUser } from "../store/user";
import Alert from "./Alert.vue";
import { AlertLevels } from "../types/alert";
import TextInput from "./TextInput.vue";
import { isRequired, validate } from "../utils/validateInput";
import Button from "./Button.vue";
import api from "../modules/api/api";
import { useRouter } from "vue-router";

const userStore = useUser();
const router = useRouter();

interface Credentials {
  email: string;
  password: string;
}

const credentials: Credentials = reactive({
  email: "",
  password: "",
});
const level = ref<AlertLevels>("danger");
const message = ref("");
const isLoading = ref(false);
const isLoginDisabled = ref(false);

const emailValid = computed(() => validate(credentials.email, [isRequired]));
const passwordValid = computed(() => validate(credentials.password, [isRequired]));
const formValid = computed(() => emailValid.value.valid || passwordValid.value.valid);

/**
 * send login
 */
async function handleSubmit() {
  isLoading.value = true;
  isLoginDisabled.value = true;
  if (!formValid.value) {
    return;
  }
  // get user token
  const resLogin = await api.user.login(credentials.email, credentials.password);
  if (resLogin.valid && resLogin.payload) {
    // save in store and get user infos
    const resCurrentUser = await userStore.login(resLogin.payload);
    message.value = resCurrentUser.message;
    if (resCurrentUser.valid) {
      level.value = "success";
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  } else {
    message.value = resLogin.message;
    isLoginDisabled.value = false;
  }
  isLoading.value = false;
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
    <Alert :message="message" :level="level" v-if="message" />
    <Button type="submit" color="primary" label="Se connecter" :loading="isLoading" :disabled="isLoginDisabled" />
  </form>
</template>
