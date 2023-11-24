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
  <div class="field">
    <label :for="id" class="label">Pays</label>
    <div class="control">
      <div class="select is-fullwidth" :class="{ 'is-loading': !countries, 'is-danger': error && !firstFocus }">
        <select :id="id" @change="handleSelect" @focusout="handleFocusOut">
          <option selected disabled>Choisissez un pays</option>
          <option v-for="country of countries" :value="country.code">
            {{ country.name }}
          </option>
        </select>
      </div>
    </div>
    <p class="help is-danger" v-if="error && !firstFocus">Vous devez choisir un pays</p>
  </div>
</template>
