<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Countries } from "../types/locations";
import Select from "./Select.vue";
import api from "../modules/api/api";

const props = defineProps<{
  id: string;
  modelValue: string;
  error?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const countries = ref<Countries[] | undefined>(undefined);
const propsModelValue = ref(props.modelValue);
const errorApi = ref(false);
const loading = ref(false);

watch(propsModelValue, () => {
  emit("update:modelValue", propsModelValue.value);
});

onMounted(async () => {
  loading.value = true;
  const resCountries = await api.countries.get();
  if (resCountries.valid && resCountries.payload) {
    countries.value = resCountries.payload as Countries[];
  } else {
    errorApi.value = true;
  }
  loading.value = false;
});
</script>

<template>
  <Select label="Pays" :id="id" v-model="propsModelValue" :required="true" errorLabel="Vous devez choisir un pays" :loading="loading" :error="errorApi">
    <option selected disabled>Choisissez un pays</option>
    <option v-for="country of countries" :value="country.code" v-if="!errorApi">
      {{ country.name }}
    </option>
    <option v-else value="FR">France</option>
  </Select>
</template>
