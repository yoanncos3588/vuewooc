<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useUser } from "../store/user";
import Alert from "./Alert.vue";
import { AlertLevels } from "../types/alert";
import TextInput from "./TextInput.vue";
import { isRequired, validate } from "../utils/validateInput";
import { Customer } from "../types/user";
import { getCountries } from "../utils/locations";
import { Countries } from "../types/locations";
import { BillingInfos, ShippingInfos } from "../types/billingShipping";
import ShippingBillingFields from "./ShippingBillingFields.vue";

const userStore = useUser();

const billingData = reactive<BillingInfos>({
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
  email: "",
  phone: "",
});

const shippingData = reactive<ShippingInfos>({
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
});

const customerData = reactive<Customer>({
  email: "",
  firstName: "",
  lastName: "",
  username: "",
  billing: billingData,
  shipping: shippingData,
});

const level = ref<AlertLevels>("danger");
const formResult = ref("");
let countries = ref<Countries[] | undefined>(undefined);

onMounted(() => {
  getCountries().then((result) => {
    countries.value = result;
  });
});

// const emailValid = computed(() => validate(credentials.email, [isRequired]));
// const passwordValid = computed(() => validate(credentials.password, [isRequired]));
// const formInvalid = computed(() => !emailValid.value.valid || !passwordValid.value.valid);

/**
 * send login
 */
async function handleSubmit() {
  // if (formInvalid.value) {
  //   return;
  // }
  // formResult.value = await userStore.login(credentials.email, credentials.password);
  // if (!formResult.value) {
  //   level.value = "success";
  //   formResult.value = "Connexion réussie, vous allez être redirigé";
  // }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="row g-3">
    <h2>Informations générales</h2>
    <div class="col-md-6">
      <TextInput id="firstname" type="text" v-model="customerData.firstName" label="Prénom" />
    </div>
    <div class="col-md-6">
      <TextInput id="lastname" type="text" v-model="customerData.lastName" label="Nom" />
    </div>
    <div class="col-12">
      <TextInput id="email" type="email" placeholder="monadresse@mail.com" v-model="customerData.email" label="Adresse email" />
    </div>

    <h2 class="mt-5">Informations de facturation</h2>
    <ShippingBillingFields :countries="countries" :data="billingData" />

    <h2 class="mt-5">Informations de livraison</h2>
    <ShippingBillingFields :countries="countries" :data="shippingData" />

    <!-- <Alert :message="formResult" :level="level" v-if="formResult" /> -->
    <div class="mt-5 col-12">
      <button type="submit" class="btn btn-primary">Créer mon compte</button>
    </div>
  </form>
</template>
