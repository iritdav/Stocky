<script setup>
import { formatDate } from '@/utils/date'

defineProps({
  entries: { type: Array, required: true },
})

defineEmits(['delete'])
</script>

<template>
  <ul class="weight-list">
    <li v-if="entries.length === 0" class="weight-list__empty">No weight entries yet.</li>
    <li v-for="entry in entries" :key="entry.id" class="weight-list__item">
      <span>{{ formatDate(entry.date) }}</span>
      <span class="weight-list__value">{{ entry.weightValue }}</span>
      <button type="button" class="weight-list__delete" @click="$emit('delete', entry)">
        Delete
      </button>
    </li>
  </ul>
</template>

<style scoped>
.weight-list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.weight-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border, rgba(60, 60, 60, 0.1));
}

.weight-list__item:last-child {
  border-bottom: none;
}

.weight-list__value {
  font-weight: 600;
}

.weight-list__delete {
  background: none;
  border: none;
  color: var(--color-danger, #d14343);
  font-size: 0.8rem;
  cursor: pointer;
}

.weight-list__empty {
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  font-size: 0.85rem;
  padding: 0.5rem 0;
}
</style>
