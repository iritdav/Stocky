<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="app-button"
    :class="`app-button--${variant}`"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1.1rem;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button--primary {
  background: var(--color-primary, #2f9e67);
  color: #fff;
}

.app-button--secondary {
  background: var(--color-primary-soft, rgba(47, 158, 103, 0.14));
  color: var(--color-primary, #2f9e67);
}

.app-button--danger {
  background: transparent;
  color: var(--color-danger, #d14343);
}

.app-button--ghost {
  background: transparent;
  color: inherit;
}
</style>
