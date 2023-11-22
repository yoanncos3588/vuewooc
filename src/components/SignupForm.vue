<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useUser } from "../store/user";
import TextInput from "./TextInput.vue";
import { isRequired, validate, isEmailValid, minMaxLength } from "../utils/validateInput";
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

// const level = ref<AlertLevels>("danger");
// const formResult = ref("");
const billingComponent = ref<null | InstanceType<typeof ShippingBillingFields>>(null);
const shippingComponent = ref<null | InstanceType<typeof ShippingBillingFields>>(null);

let countries = ref<Countries[] | undefined>(undefined);

onMounted(() => {
  getCountries().then((result) => {
    countries.value = result;
  });
});

const emailValid = computed(() => validate(customerData.email, [isRequired, isEmailValid]));
const firstNameValid = computed(() => validate(customerData.firstName, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const lastNameValid = computed(() => validate(customerData.lastName, [isRequired, minMaxLength({ min: 1, max: 40 })]));

/**
 * send login
 *
 */
async function handleSubmit() {
  console.log(billingComponent.value?.areFieldsvalid());
  console.log(shippingComponent.value?.areFieldsvalid());
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="row g-3">
    <h2>Informations généralesssfef</h2>

    <div class="col-md-6">
      <TextInput id="firstname" type="text" v-model="customerData.firstName" label="Prénom" :error="firstNameValid.error" />
    </div>
    <div class="col-md-6">
      <TextInput id="lastname" type="text" v-model="customerData.lastName" label="Nom" :error="lastNameValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="email" type="email" placeholder="monadresse@mail.com" v-model="customerData.email" label="Adresse email" :error="emailValid.error" />
    </div>

    <h2 class="mt-5">Informations de facturation</h2>
    <ShippingBillingFields :countries="countries" :data="billingData" ref="billingComponent" />

    <h2 class="mt-5">Informations de livraison</h2>

    <ShippingBillingFields :countries="countries" :data="shippingData" ref="shippingComponent" />

    <!-- <Alert :message="formResult" :level="level" v-if="formResult" /> -->
    <div class="mt-5 col-12">
      <button type="submit" class="btn btn-primary">Créer mon compte</button>
    </div>
  </form>
</template>
