<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import FoodCreateForm from '@/components/food/FoodCreateForm.vue'
import FoodSearchForm from '@/components/food/FoodSearchForm.vue'
import MealPicker from '@/components/food/MealPicker.vue'
import { useDailyLog } from '@/composables/useDailyLog'
import { useFoodLibrary } from '@/composables/useFoodLibrary'

const router = useRouter()
const dailyLog = useDailyLog()
const foodLibrary = useFoodLibrary()

const activeTab = ref('search')
const pendingFood = ref(null)

onMounted(() => {
  if (!foodLibrary.loaded.value) foodLibrary.loadItems()
})

function handlePending(food) {
  pendingFood.value = food
}

async function handleConfirm(meal) {
  const { isNew, ...food } = pendingFood.value
  if (isNew) {
    await foodLibrary.addItem({ name: food.name, caloriesPerServing: food.caloriesPerServing })
  }
  await dailyLog.logEntry({ meal, ...food })
  router.push({ name: 'daily-log' })
}
</script>

<template>
  <div class="log-food-view">
    <AppHeader title="Log Food">
      <template #actions>
        <button type="button" class="log-food-view__close" @click="router.back()">Cancel</button>
      </template>
    </AppHeader>

    <MealPicker
      v-if="pendingFood"
      :food="pendingFood"
      @back="pendingFood = null"
      @confirm="handleConfirm"
    />

    <template v-else>
      <div class="log-food-view__tabs">
        <button
          type="button"
          class="log-food-view__tab"
          :class="{ 'log-food-view__tab--active': activeTab === 'search' }"
          @click="activeTab = 'search'"
        >
          Search
        </button>
        <button
          type="button"
          class="log-food-view__tab"
          :class="{ 'log-food-view__tab--active': activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          Create new
        </button>
      </div>

      <div class="log-food-view__body">
        <FoodSearchForm
          v-if="activeTab === 'search'"
          :items="foodLibrary.items.value"
          confirm-label="Next"
          @submit="handlePending"
        />
        <FoodCreateForm v-else confirm-label="Next" @submit="handlePending" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.log-food-view {
  padding-bottom: 2rem;
}

.log-food-view__close {
  background: none;
  border: none;
  color: var(--color-primary, #2f9e67);
  font-size: 0.95rem;
  cursor: pointer;
}

.log-food-view__tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.log-food-view__tab {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  background: var(--color-border, rgba(60, 60, 60, 0.1));
  cursor: pointer;
  font-weight: 600;
}

.log-food-view__tab--active {
  background: var(--color-primary, #2f9e67);
  color: #fff;
}

.log-food-view__body {
  padding: 0 1rem;
}
</style>
