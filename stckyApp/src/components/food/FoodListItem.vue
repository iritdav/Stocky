<script setup>
defineProps({
  entry: { type: Object, required: true },
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <li class="food-list-item">
    <div class="food-list-item__info">
      <p class="food-list-item__name">{{ entry.name }}</p>
      <p class="food-list-item__meta">{{ entry.quantity }}x serving</p>
    </div>
    <div class="food-list-item__actions">
      <span class="food-list-item__calories">{{ entry.calories }} kcal</span>
      <button type="button" class="food-list-item__button" @click="$emit('edit', entry)">
        Edit
      </button>
      <button type="button" class="food-list-item__button" @click="$emit('delete', entry)">
        Delete
      </button>
    </div>
  </li>
</template>

<style scoped>
.food-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border, rgba(60, 60, 60, 0.1));
}

.food-list-item:last-child {
  border-bottom: none;
}

.food-list-item__name {
  font-weight: 600;
}

.food-list-item__meta {
  font-size: 0.8rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
}

.food-list-item__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.food-list-item__calories {
  font-weight: 600;
  white-space: nowrap;
}

.food-list-item__button {
  background: none;
  border: none;
  color: var(--color-primary, #2f9e67);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
}
</style>
