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

let countries = ref<Countries[] | undefined>(undefined);

onMounted(() => {
  getCountries().then((result) => {
    countries.value = result;
  });
});

const emailValid = computed(() => validate(customerData.email, [isRequired, isEmailValid]));
const firstNameValid = computed(() => validate(customerData.firstName, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const lastNameValid = computed(() => validate(customerData.lastName, [isRequired, minMaxLength({ min: 1, max: 40 })]));

const firstNameShippValid = computed(() => validate(shippingData.firstName, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const lastNameShippValid = computed(() => validate(shippingData.lastName, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const companyShippValid = computed(() => validate(shippingData.company, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const address1ShippValid = computed(() => validate(shippingData.address1, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const cityShippValid = computed(() => validate(shippingData.city, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const stateShippValid = computed(() => validate(shippingData.state, [isRequired, minMaxLength({ min: 1, max: 40 })]));
const postcodeShippValid = computed(() => validate(shippingData.postcode, [isRequired, minMaxLength({ min: 5, max: 5 })]));
const countryShippValid = computed(() => validate(shippingData.country, [isRequired]));

/**
 * send login
 *
 */
async function handleSubmit() {}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="row g-3">
    <h2>Informations générales</h2>

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

    <div class="col-md-6">
      <TextInput id="bill-firstname" type="text" v-model="billingData.firstName" label="Prénom" :error="firstNameBillValid.error" />
    </div>
    <div class="col-md-6">
      <TextInput id="bill-lastname" type="text" v-model="billingData.lastName" label="Nom" :error="lastNameBillValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="bill-company" type="text" v-model="billingData.company" label="Société (optionnel)" :error="companyBillValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="bill-address1" type="text" v-model="billingData.address1" label="Adresse" :error="address1BillValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="bill-address2" type="text" v-model="billingData.address2" label="Complément d'adresse (optionnel)" />
    </div>
    <div class="col-md-5">
      <TextInput id="bill-city" type="text" v-model="billingData.city" label="Ville" :error="cityBillValid.error" />
    </div>
    <div class="col-md-5">
      <TextInput id="bill-state" type="text" v-model="billingData.state" label="Département" :error="stateBillValid.error" />
    </div>
    <div class="col-md-2">
      <TextInput id="bill-postcode" type="text" v-model="billingData.postcode" label="Code postal" :error="postcodeBillValid.error" />
    </div>
    <div class="col-12">
      <label for="bill-country">Pays</label>
      <select id="bill-country" v-if="countries" class="form-select" v-model="billingData.country">
        <option v-for="country of countries" :value="country.code">
          {{ country.name }}
        </option>
      </select>
    </div>
    <div class="col-md-6" v-if="'email' in billingData">
      <TextInput id="bill-email" type="email" v-model="billingData.email" label="Email" :error="emailBillValid.error" />
    </div>
    <div class="col-md-6" v-if="'phone' in billingData">
      <TextInput id="bill-phone" type="number" v-model="billingData.phone" label="Téléphone" :error="phoneBillValid.error" />
    </div>

    <h2 class="mt-5">Informations de livraison</h2>

    <div class="col-md-6">
      <TextInput id="bill-firstname" type="text" v-model="shippingData.firstName" label="Prénom" :error="firstNameShippValid.error" />
    </div>
    <div class="col-md-6">
      <TextInput id="bill-lastname" type="text" v-model="shippingData.lastName" label="Nom" :error="lastNameShippValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="bill-company" type="text" v-model="shippingData.company" label="Société (optionnel)" :error="companyShippValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="bill-address1" type="text" v-model="shippingData.address1" label="Adresse" :error="address1ShippValid.error" />
    </div>
    <div class="col-12">
      <TextInput id="bill-address2" type="text" v-model="shippingData.address2" label="Complément d'adresse (optionnel)" />
    </div>
    <div class="col-md-5">
      <TextInput id="bill-city" type="text" v-model="shippingData.city" label="Ville" :error="cityShippValid.error" />
    </div>
    <div class="col-md-5">
      <TextInput id="bill-state" type="text" v-model="shippingData.state" label="Département" :error="stateShippValid.error" />
    </div>
    <div class="col-md-2">
      <TextInput id="bill-postcode" type="text" v-model="shippingData.postcode" label="Code postal" :error="postcodeShippValid.error" />
    </div>
    <div class="col-12">
      <label for="bill-country">Pays</label>
      <select id="bill-country" v-if="countries" class="form-select" v-model="shippingData.country">
        <option v-for="country of countries" :value="country.code">
          {{ country.name }}
        </option>
      </select>
    </div>

    <!-- <ShippingBillingFields :countries="countries" :data="shippingData" /> -->

    <!-- <Alert :message="formResult" :level="level" v-if="formResult" /> -->
    <div class="mt-5 col-12">
      <button type="submit" class="btn btn-primary">Créer mon compte</button>
    </div>
  </form>
</template>
