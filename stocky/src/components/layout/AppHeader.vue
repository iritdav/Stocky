<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <header class="app-header">
    <h1 class="app-header__title">{{ title }}</h1>
    <div v-if="$slots.actions" class="app-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.app-header__title {
  font-size: 1.25rem;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
</style>
