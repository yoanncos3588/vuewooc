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
  if (isFormValid) {
    if (useShipInfosForBill.value) {
      // put billing infos into shipping
      const { email, phone, ...shippingInfos } = customerData.billing;
      customerData.shipping = shippingInfos;
    }
    const result = await userStore.createCustomer(customerData);
    apiMessage.value = result.message;
    userCreated.value = result.valid;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="row g-3">
    <h2>Informations générale</h2>

    <div class="col-md-6">
      <TextInput id="firstname" type="text" v-model="customerData.firstName" label="Prénom" :error="validator.firstNameValid.error" />
    </div>
    <div class="col-md-6">
      <TextInput id="lastname" type="text" v-model="customerData.lastName" label="Nom" :error="validator.lastNameValid.error" />
    </div>
    <div class="col-12">
      <TextInput
        id="email"
        type="email"
        placeholder="monadresse@mail.com"
        v-model="customerData.email"
        label="Adresse email"
        :error="validator.emailValid.error"
      />
    </div>

    <h2 class="mt-5">Informations de facturation</h2>
    <ShippingBillingFields :data="billingData" ref="billingComponent" key="billing" />

    <h2 class="mt-5">Informations de livraison</h2>

    <div class="col-12">
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="useShipForBill" checked v-model="useShipInfosForBill" />
        <label class="form-check-label" for="useShipForBill">Utiliser mes informations de facturation</label>
      </div>
    </div>

    <ShippingBillingFields :data="shippingData" ref="shippingComponent" v-if="!useShipInfosForBill" key="shipping" />

    <div class="col-12 mt-5">
      <Alert :message="apiMessage" :level="alertLevel" v-if="apiMessage" />
      <button type="submit" class="btn btn-primary">Créer mon compte</button>
    </div>
  </form>
</template>
