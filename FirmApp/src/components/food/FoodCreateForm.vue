<script setup>
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

defineProps({
  confirmLabel: { type: String, default: 'Add to log' },
})

const emit = defineEmits(['submit'])

const name = ref('')
const caloriesPerServing = ref('')
const quantity = ref(1)

function handleSubmit() {
  if (!name.value || !caloriesPerServing.value) return
  emit('submit', {
    isNew: true,
    name: name.value,
    caloriesPerServing: Number(caloriesPerServing.value),
    quantity: Number(quantity.value) || 1,
  })
  name.value = ''
  caloriesPerServing.value = ''
  quantity.value = 1
}
</script>

<template>
  <form class="food-create-form" @submit.prevent="handleSubmit">
    <AppInput v-model="name" label="Food name" placeholder="e.g. Grilled chicken" required />
    <AppInput
      v-model="caloriesPerServing"
      type="number"
      min="0"
      label="Calories per serving"
      placeholder="e.g. 250"
      required
    />
    <AppInput v-model="quantity" type="number" min="0" step="0.1" label="Quantity (servings)" />
    <AppButton type="submit">{{ confirmLabel }}</AppButton>
  </form>
</template>

<style scoped>
.food-create-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
