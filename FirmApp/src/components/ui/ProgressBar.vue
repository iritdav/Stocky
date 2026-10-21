<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  max: { type: Number, required: true },
})

const percent = computed(() => {
  if (props.max <= 0) return 0
  return Math.min(100, Math.round((props.value / props.max) * 100))
})

const isOverGoal = computed(() => props.value > props.max)
</script>

<template>
  <div class="progress-bar">
    <div
      class="progress-bar__fill"
      :class="{ 'progress-bar__fill--over': isOverGoal }"
      :style="{ width: percent + '%' }"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: var(--color-border, rgba(60, 60, 60, 0.15));
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: var(--color-primary, #2f9e67);
  transition: width 0.2s ease;
}

.progress-bar__fill--over {
  background: var(--color-danger, #d14343);
}
</style>
