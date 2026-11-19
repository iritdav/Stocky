<script setup>
import { computed } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import FoodListItem from '@/components/food/FoodListItem.vue'
import { useDailyLog } from '@/composables/useDailyLog'
import { MEAL_LABELS } from '@/utils/calories'

const props = defineProps({
  meal: { type: String, required: true },
  entries: { type: Array, required: true },
})

const dailyLog = useDailyLog()

const mealTotal = computed(() => props.entries.reduce((sum, entry) => sum + entry.calories, 0))

function handleDelete(entry) {
  dailyLog.removeEntry(entry.id)
}

function handleEdit(entry) {
  const nextQuantity = window.prompt('Update quantity (servings)', entry.quantity)
  if (nextQuantity === null) return
  const parsed = Number(nextQuantity)
  if (!Number.isFinite(parsed) || parsed <= 0) return
  dailyLog.updateEntryQuantity(entry.id, parsed)
}
</script>

<template>
  <AppCard class="meal-section">
    <header class="meal-section__header">
      <h2 class="meal-section__title">{{ MEAL_LABELS[meal] }}</h2>
      <span class="meal-section__total">{{ mealTotal }} kcal</span>
    </header>

    <ul v-if="entries.length" class="meal-section__list">
      <FoodListItem
        v-for="entry in entries"
        :key="entry.id"
        :entry="entry"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </ul>
    <p v-else class="meal-section__empty">No items logged yet.</p>
  </AppCard>
</template>

<style scoped>
.meal-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meal-section__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.meal-section__title {
  font-size: 1rem;
}

.meal-section__total {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
}

.meal-section__list {
  list-style: none;
}

.meal-section__empty {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
}
</style>
