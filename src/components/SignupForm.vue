<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useUser } from "../store/user";
import TextInput from "./TextInput.vue";
import { isRequired, validate, isEmailValid, minMaxLength } from "../utils/validateInput";
import { Customer } from "../types/user";
import { BillingInfos, ShippingInfos } from "../types/billingShipping";
import ShippingBillingFields from "./ShippingBillingFields.vue";
import { AlertLevels } from "../types/alert";
import Alert from "./Alert.vue";

// stores
const userStore = useUser();

// datas
const billingData = reactive<BillingInfos>({
  firstName: "",
  lastName: "",
  company: "",
  address_1: "",
  address_2: "",
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
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "",
});

const customerData = reactive<Customer>({
  email: "",
  firstName: "",
  lastName: "",
  get username() {
    return `${this.firstName} ${this.lastName}`;
  },
  billing: billingData,
  shipping: shippingData,
});

// refs
const userCreated = ref(false);
const isLoading = ref(false);
const apiMessage = ref<string | undefined>(undefined);
const billingComponent = ref<null | InstanceType<typeof ShippingBillingFields>>(null);
const shippingComponent = ref<null | InstanceType<typeof ShippingBillingFields>>(null);
const useShipInfosForBill = ref(true);

// valid fields
const validator = computed(() => {
  return {
    emailValid: validate(customerData.email, [isRequired, isEmailValid]),
    firstNameValid: validate(customerData.firstName, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    lastNameValid: validate(customerData.lastName, [isRequired, minMaxLength({ min: 1, max: 40 })]),
  };
});

// valid form
const isFormValid = computed(() => {
  const generalFieldsValid = Object.values(validator.value).every((item) => {
    if (item.valid) {
      return true;
    }
  });
  const shippingFieldsValid = useShipInfosForBill.value ? true : shippingComponent.value?.areFieldsvalid();
  return Boolean(generalFieldsValid && billingComponent.value?.areFieldsvalid() && shippingFieldsValid);
});

// alert level
const alertLevel = computed<AlertLevels>(() => {
  return userCreated.value ? "success" : "danger";
});

// submit
async function handleSubmit() {
  isLoading.value = true;
  if (isFormValid.value) {
    console.log("formvalid");
    if (useShipInfosForBill.value) {
      // put billing infos into shipping
      const { email, phone, ...shippingInfos } = customerData.billing;
      customerData.shipping = shippingInfos;
    }
    const result = await userStore.createCustomer(customerData);
    apiMessage.value = result.message;
    userCreated.value = result.valid;
  }
  isLoading.value = false;
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="">
    <div class="columns">
      <div class="column is-6">
        <div class="box">
          <h2 class="title is-4">
            <span class="icon-text">
              <span class="icon">
                <i class="fa-solid fa-person-walking"></i>
              </span>
              <span>Informations générale</span>
            </span>
          </h2>
          <div class="columns">
            <div class="column is-6">
              <TextInput id="firstname" type="text" v-model="customerData.firstName" label="Prénom" :error="validator.firstNameValid.error" />
            </div>
            <div class="column is-6">
              <TextInput id="lastname" type="text" v-model="customerData.lastName" label="Nom" :error="validator.lastNameValid.error" />
            </div>
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="monadresse@mail.com"
            v-model="customerData.email"
            label="Adresse email"
            :error="validator.emailValid.error"
          />
        </div>
      </div>
    </div>

    <div class="columns my-5">
      <div class="column is-12">
        <label class="checkbox" for="useShipForBill">
          <input type="checkbox" id="useShipForBill" checked v-model="useShipInfosForBill" />
          Utiliser les mêmes informations pour la facturation et la livraison
        </label>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-6 is-vertical is-parent">
        <div class="box">
          <h2 class="title is-4">
            <span class="icon-text">
              <span class="icon"><i class="fa-solid fa-file-invoice-dollar"></i></span>
              <span>{{ `Informations de facturation ${useShipInfosForBill ? "et livraison" : ""}` }}</span>
            </span>
          </h2>
          <h2 class="title is-4"></h2>
          <ShippingBillingFields :data="billingData" ref="billingComponent" key="billing" />
        </div>
      </div>
      <div class="tile is-6 is-vertical is-parent" v-if="!useShipInfosForBill" key="shipping">
        <div class="box">
          <h2 class="title is-4">
            <span class="icon-text">
              <span class="icon"><i class="fa-solid fa-truck-fast"></i></span>
              <span>Informations de livraison</span>
            </span>
          </h2>
          <ShippingBillingFields :data="shippingData" ref="shippingComponent" />
        </div>
      </div>
    </div>

    <Alert :message="apiMessage" :level="alertLevel" v-if="apiMessage" />

    <button type="submit" class="button is-primary" :class="{ 'is-loading': isLoading }">Créer mon compte</button>
  </form>
</template>
