<script setup>
import { onMounted } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import WeightChart from '@/components/weight/WeightChart.vue'
import WeightEntryForm from '@/components/weight/WeightEntryForm.vue'
import WeightList from '@/components/weight/WeightList.vue'
import { useWeightEntries } from '@/composables/useWeightEntries'

const weightEntries = useWeightEntries()

onMounted(() => {
  weightEntries.loadEntries()
})

function handleSubmit(entry) {
  weightEntries.logWeight(entry)
}

function handleDelete(entry) {
  if (!window.confirm('Delete this weight entry?')) return
  weightEntries.removeEntry(entry.id)
}
</script>

<template>
  <div class="weight-tracker-view">
    <AppHeader title="Weight Tracker" />

    <AppCard class="weight-tracker-view__section">
      <WeightEntryForm @submit="handleSubmit" />
    </AppCard>

    <AppCard class="weight-tracker-view__section">
      <WeightChart />
    </AppCard>

    <AppCard class="weight-tracker-view__section">
      <WeightList :entries="weightEntries.entries.value" @delete="handleDelete" />
    </AppCard>
  </div>
</template>

<style scoped>
.weight-tracker-view {
  padding-bottom: calc(var(--nav-height, 60px) + 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.weight-tracker-view__section {
  margin: 0 1rem;
}
</style>
