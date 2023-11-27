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
import Button from "./Button.vue";
import Title from "./Title.vue";

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
const titleBilling = computed<string>(() => `Informations de facturation ${useShipInfosForBill ? "et livraison" : ""}`);

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
          <Title level="h2" size="4" iconClass="fa-solid fa-person-walking" text="Informations générale" />
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
          <Title level="h2" size="4" iconClass="fa-solid fa-file-invoice-dollar" :text="titleBilling" />

          <ShippingBillingFields :data="billingData" ref="billingComponent" key="billing" />
        </div>
      </div>
      <div class="tile is-6 is-vertical is-parent" v-if="!useShipInfosForBill" key="shipping">
        <div class="box">
          <Title level="h2" size="4" iconClass="fa-solid fa-truck-fast" text="Informations de livraison" />
          <ShippingBillingFields :data="shippingData" ref="shippingComponent" />
        </div>
      </div>
    </div>

    <Alert :message="apiMessage" :level="alertLevel" v-if="apiMessage" />

    <Button color="primary" :loading="isLoading" label="Créer mon compte" type="submit" />
  </form>
</template>
