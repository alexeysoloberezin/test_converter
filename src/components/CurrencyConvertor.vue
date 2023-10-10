<template>
  <div class="currencyConvertor">
    <h2>Конвертер валют</h2>
    <template v-if="!errors.errorCurrencyList">
      <InputText type="number" v-model.number="currencyValue" @change="fetchCurrency" placeholder="Value"/>

      <Dropdown
          v-model="selectedCurrency"
          @change="fetchCurrency"
          :options="currency"
          :loading="loadingCurrency"
          filter
          optionLabel="name"
          :placeholder="!loadingCurrency ? 'Select a Country' : 'Loading...'"
          class="w-full"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.name }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
        </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.name }}</div>
          </div>
        </template>
      </Dropdown>

      <InputNumber v-model="currencyFinal" :disabled="loadingFinalValue" inputId="currency-rub" readonly mode="currency"
                   currency="RUB" locale="ru-RU" class="pointer-events-none"/>
      <label v-if="loadingFinalValue">Loading...</label>
      <div v-if="errors.errorFinalValue" class="text-red-500 font-bold">{{ errors.errorFinalValue }}</div>
    </template>
    <div v-else class="text-red-500 font-bold">{{ errors.errorCurrencyList }}</div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import CurrencyService from "../Services/CurrencyService";
import {Currency} from "../types/CurrencyConvertor/CurrencyConvertorTypes";

const currencyService = new CurrencyService()

const selectedCurrency = ref<Currency | null>(null)
const currency = ref<Currency[] | null>(null)

const currencyValue = ref(0)
const currencyFinal = ref(0)

const loadingCurrency = ref(false)
const loadingFinalValue = ref(false)

const errors = ref({
  errorCurrencyList: '',
  errorFinalValue: '',
})

onMounted(() => {
  selectedCurrency.value = currencyService.restoreCurrency()

  loadingCurrency.value = true
  currencyService.fetchCurrencyList()
      .then(() => {
        errors.value.errorCurrencyList = ''
        currency.value = currencyService.getCurrencyList()
      })
      .catch((res) => {
        // if(res.status === 500)
        // if(res.status === 404)
        errors.value.errorCurrencyList = 'Currency list not found.'
      })
      .finally(() => {
        // for delay
        setTimeout(() => {
          loadingCurrency.value = false
        }, 1000)
      })
})

const fetchCurrency = () => {
  saveCurrency()
  if (!selectedCurrency.value || !currencyValue.value) return null;

  loadingFinalValue.value = true
  currencyFinal.value = 0
  currencyService.fetchCurrencyItem(selectedCurrency.value)
      .then(() => {
        setTimeout(() => {
          errors.value.errorFinalValue = ``
          currencyFinal.value = currencyService.getActiveCourse(currencyValue.value)
        }, 500)
      })
      .catch(() => {
        errors.value.errorFinalValue = `Currency not found.`
      })
      .finally(() => {
        setTimeout(() => {
          loadingFinalValue.value = false
        }, 500)
      })
}

const saveCurrency = () => {
  if (selectedCurrency.value) {
    currencyService.saveCurrency(selectedCurrency.value)
  }
}
</script>

<style lang="scss">
.currencyConvertor {
  max-width: 1000px;
  margin: 50px auto;
  grid-row-gap: 10px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.13);
  display: grid;
  h2{
    margin: 0;
  }
}
</style>