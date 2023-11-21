<script lang="ts" setup>
import { BillingInfos, ShippingInfos, isBilling } from "../types/billingShipping";
import { Countries } from "../types/locations";
import TextInput from "./TextInput.vue";
const props = defineProps<{
  data: ShippingInfos | BillingInfos;
  countries: Countries[] | undefined;
}>();

const type = isBilling(props.data) ? "shipping" : "billing";
</script>

<template>
  <div class="col-md-6">
    <TextInput :id="`${type}-firstname`" type="text" v-model="data.firstName" label="Prénom" />
  </div>
  <div class="col-md-6">
    <TextInput :id="`${type}-lastname`" type="text" v-model="data.lastName" label="Nom" />
  </div>
  <div class="col-12">
    <TextInput :id="`${type}-company`" type="text" v-model="data.company" label="Société (optionnel)" />
  </div>
  <div class="col-12">
    <TextInput :id="`${type}-address1`" type="text" v-model="data.address1" label="Adresse" />
  </div>
  <div class="col-12">
    <TextInput :id="`${type}-address2`" type="text" v-model="data.address2" label="Complément d'adresse (optionnel)" />
  </div>
  <div class="col-md-5">
    <TextInput :id="`${type}-city`" type="text" v-model="data.city" label="Ville" />
  </div>
  <div class="col-md-5">
    <TextInput :id="`${type}-state`" type="text" v-model="data.state" label="Département" />
  </div>
  <div class="col-md-2">
    <TextInput :id="`${type}-postcode`" type="text" v-model="data.postcode" label="Code postal" />
  </div>
  <div class="col-12">
    <label :for="`${type}-country`">Pays</label>
    <select :id="`${type}-country`" v-if="countries" class="form-select">
      <option v-for="country of countries" :value="country.code">
        {{ country.name }}
      </option>
    </select>
  </div>
  <div class="col-md-6" v-if="'email' in data">
    <TextInput :id="`${type}-email`" type="email" v-model="data.email" label="Email" />
  </div>
  <div class="col-md-6" v-if="'phone' in data">
    <TextInput :id="`${type}-phone`" type="number" v-model="data.phone" label="Téléphone" />
  </div>
</template>
