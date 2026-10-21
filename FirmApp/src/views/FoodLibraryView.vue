<script setup>
import { computed, onMounted, ref } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { useFoodLibrary } from '@/composables/useFoodLibrary'

const foodLibrary = useFoodLibrary()
const search = ref('')

onMounted(() => {
  if (!foodLibrary.loaded.value) foodLibrary.loadItems()
})

const results = computed(() => foodLibrary.search(search.value))

function handleEdit(item) {
  const nextName = window.prompt('Food name', item.name)
  if (nextName === null || !nextName.trim()) return
  const nextCalories = window.prompt('Calories per serving', item.caloriesPerServing)
  if (nextCalories === null) return
  const parsed = Number(nextCalories)
  if (!Number.isFinite(parsed) || parsed < 0) return
  foodLibrary.editItem(item.id, { name: nextName.trim(), caloriesPerServing: parsed })
}

function handleDelete(item) {
  if (!window.confirm(`Delete "${item.name}" from your library?`)) return
  foodLibrary.removeItem(item.id)
}
</script>

<template>
  <div class="food-library-view">
    <AppHeader title="Food Library" />

    <div class="food-library-view__search">
      <AppInput v-model="search" label="Search" placeholder="Search your food items" />
    </div>

    <AppCard class="food-library-view__list">
      <p v-if="results.length === 0" class="food-library-view__empty">
        No food items yet. Add one from the daily log.
      </p>
      <ul v-else class="food-library-view__items">
        <li v-for="item in results" :key="item.id" class="food-library-view__item">
          <div>
            <p class="food-library-view__name">{{ item.name }}</p>
            <p class="food-library-view__calories">{{ item.caloriesPerServing }} kcal/serving</p>
          </div>
          <div class="food-library-view__actions">
            <button type="button" @click="handleEdit(item)">Edit</button>
            <button type="button" @click="handleDelete(item)">Delete</button>
          </div>
        </li>
      </ul>
    </AppCard>
  </div>
</template>

<style scoped>
.food-library-view {
  padding-bottom: calc(var(--nav-height, 60px) + 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.food-library-view__search {
  padding: 0 1rem;
}

.food-library-view__list {
  margin: 0 1rem;
}

.food-library-view__items {
  list-style: none;
}

.food-library-view__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border, rgba(60, 60, 60, 0.1));
}

.food-library-view__item:last-child {
  border-bottom: none;
}

.food-library-view__name {
  font-weight: 600;
}

.food-library-view__calories {
  font-size: 0.8rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
}

.food-library-view__actions {
  display: flex;
  gap: 0.6rem;
}

.food-library-view__actions button {
  background: none;
  border: none;
  color: var(--color-primary, #2f9e67);
  cursor: pointer;
  font-size: 0.85rem;
}

.food-library-view__empty {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
}
</style>
