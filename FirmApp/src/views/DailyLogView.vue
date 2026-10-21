<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MealSection from '@/components/food/MealSection.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyLog } from '@/composables/useDailyLog'
import { useFoodLibrary } from '@/composables/useFoodLibrary'
import { MEALS } from '@/utils/calories'

const auth = useAuth()
const dailyLog = useDailyLog()
const foodLibrary = useFoodLibrary()

onMounted(() => {
  dailyLog.loadForDate(dailyLog.date.value)
  if (!foodLibrary.loaded.value) foodLibrary.loadItems()
})
</script>

<template>
  <div class="daily-log-view">
    <AppHeader :title="dailyLog.formattedDate.value">
      <template #actions>
        <button
          type="button"
          class="daily-log-view__nav-button"
          @click="dailyLog.goToPreviousDay()"
        >
          &larr;
        </button>
        <button type="button" class="daily-log-view__nav-button" @click="dailyLog.goToNextDay()">
          &rarr;
        </button>
      </template>
    </AppHeader>

    <div class="daily-log-view__summary">
      <p class="daily-log-view__total">
        {{ dailyLog.totalCalories.value }} / {{ auth.dailyCalorieGoal.value }} kcal
      </p>
      <ProgressBar :value="dailyLog.totalCalories.value" :max="auth.dailyCalorieGoal.value" />
    </div>

    <div class="daily-log-view__meals">
      <MealSection
        v-for="meal in MEALS"
        :key="meal"
        :meal="meal"
        :entries="dailyLog.entriesByMeal.value[meal]"
      />
    </div>
  </div>
</template>

<style scoped>
.daily-log-view {
  padding-bottom: calc(var(--nav-height, 60px) + 1.5rem);
}

.daily-log-view__nav-button {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: inherit;
}

.daily-log-view__summary {
  padding: 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.daily-log-view__total {
  font-weight: 600;
}

.daily-log-view__meals {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
}
</style>
