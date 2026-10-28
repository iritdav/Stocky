<script setup>
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import { MEALS, MEAL_LABELS, computeCalories } from '@/utils/calories'

const props = defineProps({
  food: { type: Object, required: true },
})

const emit = defineEmits(['back', 'confirm'])

const meal = ref(MEALS[0])
</script>

<template>
  <div class="meal-picker">
    <div class="meal-picker__summary">
      <p class="meal-picker__name">{{ food.name }}</p>
      <p class="meal-picker__calories">
        {{ computeCalories(food.caloriesPerServing, food.quantity) }} kcal
        <span class="meal-picker__detail">
          ({{ food.caloriesPerServing }} kcal x {{ food.quantity }})
        </span>
      </p>
    </div>

    <div class="meal-picker__meals">
      <button
        v-for="option in MEALS"
        :key="option"
        type="button"
        class="meal-picker__meal"
        :class="{ 'meal-picker__meal--active': meal === option }"
        @click="meal = option"
      >
        {{ MEAL_LABELS[option] }}
      </button>
    </div>

    <div class="meal-picker__actions">
      <AppButton type="button" variant="ghost" @click="$emit('back')">Back</AppButton>
      <AppButton type="button" @click="$emit('confirm', meal)">Log food</AppButton>
    </div>
  </div>
</template>

<style scoped>
.meal-picker {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.meal-picker__summary {
  text-align: center;
}

.meal-picker__name {
  font-weight: 600;
  font-size: 1.1rem;
}

.meal-picker__calories {
  color: var(--color-primary, #2f9e67);
  font-weight: 700;
}

.meal-picker__detail {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.5));
  font-weight: 400;
  font-size: 0.8rem;
}

.meal-picker__meals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.meal-picker__meal {
  padding: 0.75rem;
  border: 1px solid var(--color-border, rgba(60, 60, 60, 0.2));
  border-radius: 10px;
  background: var(--color-surface, #fff);
  font-weight: 600;
  cursor: pointer;
}

.meal-picker__meal--active {
  background: var(--color-primary, #2f9e67);
  border-color: var(--color-primary, #2f9e67);
  color: #fff;
}

.meal-picker__actions {
  display: flex;
  gap: 0.6rem;
}

.meal-picker__actions > :first-child {
  flex: 0;
}

.meal-picker__actions > :last-child {
  flex: 1;
}
</style>
