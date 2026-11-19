<script setup>
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'

const props = defineProps({
  items: { type: Array, required: true },
  confirmLabel: { type: String, default: 'Add to log' },
})

const emit = defineEmits(['submit'])

const search = ref('')
const selectedItem = ref(null)
const quantity = ref(1)

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return props.items
  return props.items.filter((item) => item.name.toLowerCase().includes(term))
})

function selectItem(item) {
  selectedItem.value = item
}

function handleSubmit() {
  if (!selectedItem.value) return
  emit('submit', {
    foodItemId: selectedItem.value.id,
    name: selectedItem.value.name,
    caloriesPerServing: selectedItem.value.caloriesPerServing,
    quantity: Number(quantity.value) || 1,
  })
  search.value = ''
  selectedItem.value = null
  quantity.value = 1
}
</script>

<template>
  <div class="food-search-form">
    <AppInput v-model="search" label="Search your food library" placeholder="Search by name" />

    <ul v-if="!selectedItem" class="food-search-form__results">
      <li v-if="filteredItems.length === 0" class="food-search-form__empty">
        No matching items. Try the "Create new" tab instead.
      </li>
      <li
        v-for="item in filteredItems"
        :key="item.id"
        class="food-search-form__result"
        @click="selectItem(item)"
      >
        <span>{{ item.name }}</span>
        <span class="food-search-form__calories">{{ item.caloriesPerServing }} kcal/serving</span>
      </li>
    </ul>

    <form v-else class="food-search-form__confirm" @submit.prevent="handleSubmit">
      <p class="food-search-form__selected">{{ selectedItem.name }}</p>
      <AppInput v-model="quantity" type="number" min="0" step="0.1" label="Quantity (servings)" />
      <div class="food-search-form__confirm-actions">
        <AppButton type="button" variant="ghost" @click="selectedItem = null">Back</AppButton>
        <AppButton type="submit">{{ confirmLabel }}</AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.food-search-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.food-search-form__results {
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.food-search-form__result {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0.4rem;
  border-radius: 8px;
  cursor: pointer;
}

.food-search-form__result:hover {
  background: var(--color-primary-soft, rgba(47, 158, 103, 0.14));
}

.food-search-form__calories {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
}

.food-search-form__empty {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
  padding: 0.5rem 0;
}

.food-search-form__selected {
  font-weight: 600;
}

.food-search-form__confirm {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.food-search-form__confirm-actions {
  display: flex;
  gap: 0.6rem;
}
</style>
