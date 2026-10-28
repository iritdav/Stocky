<script setup>
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js'
import AppButton from '@/components/ui/AppButton.vue'
import { useWeightEntries } from '@/composables/useWeightEntries'
import { formatDate } from '@/utils/date'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const weightEntries = useWeightEntries()
const rangeDays = ref(30)

const rangeEntries = computed(() =>
  weightEntries
    .entriesWithinDays(rangeDays.value)
    .slice()
    .sort((a, b) => (a.date > b.date ? 1 : -1)),
)

const chartData = computed(() => ({
  labels: rangeEntries.value.map((entry) => formatDate(entry.date)),
  datasets: [
    {
      label: 'Weight',
      data: rangeEntries.value.map((entry) => entry.weightValue),
      borderColor: '#2f9e67',
      backgroundColor: 'rgba(47, 158, 103, 0.14)',
      tension: 0.3,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: false } },
}
</script>

<template>
  <div class="weight-chart">
    <div class="weight-chart__toggle">
      <AppButton
        variant="ghost"
        :class="{ 'weight-chart__toggle--active': rangeDays === 30 }"
        @click="rangeDays = 30"
      >
        30 days
      </AppButton>
      <AppButton
        variant="ghost"
        :class="{ 'weight-chart__toggle--active': rangeDays === 90 }"
        @click="rangeDays = 90"
      >
        90 days
      </AppButton>
    </div>

    <p v-if="rangeEntries.length === 0" class="weight-chart__empty">
      Log a weight entry to see your trend.
    </p>
    <Line v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.weight-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.weight-chart__toggle {
  display: flex;
  gap: 0.5rem;
}

.weight-chart__toggle--active {
  color: var(--color-primary, #2f9e67);
  font-weight: 700;
}

.weight-chart__empty {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
}
</style>
