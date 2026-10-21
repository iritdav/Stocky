<script setup>
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { todayLocal } from '@/utils/date'

const emit = defineEmits(['submit'])

const date = ref(todayLocal())
const weightValue = ref('')

function handleSubmit() {
  if (!weightValue.value) return
  emit('submit', { date: date.value, weightValue: Number(weightValue.value) })
  weightValue.value = ''
}
</script>

<template>
  <form class="weight-entry-form" @submit.prevent="handleSubmit">
    <AppInput v-model="date" type="date" label="Date" required />
    <AppInput v-model="weightValue" type="number" min="0" step="0.1" label="Weight" required />
    <AppButton type="submit">Log weight</AppButton>
  </form>
</template>

<style scoped>
.weight-entry-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
