<script lang="ts" setup>
import { computed } from "vue";
import { BillingInfos, ShippingInfos, isBilling } from "../types/billingShipping";
import { validate, isRequired, minMaxLength, isEmailValid } from "../utils/validateInput";
import TextInput from "./TextInput.vue";
import SelectCountry from "./SelectCountry.vue";

const props = defineProps<{
  data: ShippingInfos | BillingInfos;
}>();

defineExpose({
  areFieldsvalid,
});

const type = isBilling(props.data) ? "shipping" : "billing";

const validator = computed(() => {
  return {
    firstNameValid: validate(props.data.firstName, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    lastNameNameValid: validate(props.data.lastName, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    companyValid: validate(props.data.company, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    address1Valid: validate(props.data.address1, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    cityValid: validate(props.data.city, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    stateValid: validate(props.data.state, [isRequired, minMaxLength({ min: 1, max: 40 })]),
    postcodeValid: validate(props.data.postcode, [isRequired, minMaxLength({ min: 1, max: 5 })]),
    countryValid: validate(props.data.country, [isRequired]),
    emailValid: "email" in props.data ? validate(props.data.email, [isRequired, isEmailValid, minMaxLength({ min: 1, max: 40 })]) : undefined,
    phoneValid: "phone" in props.data ? validate(props.data.phone, [isRequired, minMaxLength({ min: 1, max: 25 })]) : undefined,
  };
});

function areFieldsvalid() {
  return Object.values(validator.value).every((item) => {
    if (item !== undefined) {
      return item.valid !== undefined && item.valid;
    } else {
      // some fields are missing on shipping type
      return true;
    }
  });
}
</script>

<template>
  <div class="col-md-6">
    <TextInput :id="`${type}-firstname`" type="text" v-model="data.firstName" label="Prénom" :error="validator.firstNameValid.error" />
  </div>
  <div class="col-md-6">
    <TextInput :id="`${type}-lastname`" type="text" v-model="data.lastName" label="Nom" :error="validator.lastNameNameValid.error" />
  </div>
  <div class="col-12">
    <TextInput :id="`${type}-company`" type="text" v-model="data.company" label="Société (optionnel)" :error="validator.companyValid.error" />
  </div>
  <div class="col-12">
    <TextInput :id="`${type}-address1`" type="text" v-model="data.address1" label="Adresse" :error="validator.address1Valid.error" />
  </div>
  <div class="col-12">
    <TextInput :id="`${type}-address2`" type="text" v-model="data.address2" label="Complément d'adresse (optionnel)" />
  </div>
  <div class="col-md-5">
    <TextInput :id="`${type}-city`" type="text" v-model="data.city" label="Ville" :error="validator.cityValid.error" />
  </div>
  <div class="col-md-5">
    <TextInput :id="`${type}-state`" type="text" v-model="data.state" label="Département" :error="validator.stateValid.error" />
  </div>
  <div class="col-md-2">
    <TextInput :id="`${type}-postcode`" type="number" v-model="data.postcode" label="Code postal" :error="validator.postcodeValid.error" />
  </div>
  <div class="col-12">
    <SelectCountry :id="`${type}-country`" v-model="data.country" :error="validator.countryValid.error" />
  </div>
  <div class="col-md-6" v-if="'email' in data">
    <TextInput :id="`${type}-email`" type="email" v-model="data.email" label="Email" :error="validator.emailValid?.error" />
  </div>
  <div class="col-md-6" v-if="'phone' in data">
    <TextInput :id="`${type}-phone`" type="text" v-model="data.phone" label="Téléphone" :error="validator.phoneValid?.error" />
  </div>
</template>
