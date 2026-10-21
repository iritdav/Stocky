<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background: var(--color-surface, #fff);
  border: 1px solid var(--color-border, rgba(60, 60, 60, 0.12));
  border-radius: 12px;
  padding: 1rem;
}
</style>
