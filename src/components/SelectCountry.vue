<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getCountries } from "../utils/locations";
import { Countries } from "../types/locations";

defineProps<{
  id: string;
  modelValue: string;
  error?: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

let countries = ref<Countries[] | undefined>(undefined);
const firstFocus = ref(true);

onMounted(() => {
  getCountries().then((result) => {
    countries.value = result;
  });
});

function handleFocusOut() {
  firstFocus.value = false;
}

function handleSelect(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  emit("update:modelValue", value);
}
</script>

<template>
  <label :for="id">Pays</label>
  <select :id="id" v-if="countries" class="form-select" @change="handleSelect" @focusout="handleFocusOut" :class="error && !firstFocus ? `is-invalid` : ``">
    <option selected disabled hidden>Choisissez un pays</option>
    <option v-for="country of countries" :value="country.code">
      {{ country.name }}
    </option>
  </select>
  <select v-else disabled class="form-select animation-blink">
    <option selected disabled hidden>Chargement des pays…</option>
  </select>
  <div class="invalid-feedback" v-if="error">Vous devez choisir un pays</div>
</template>
