<script setup>
defineProps({
  title: { type: String, default: '' },
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="app-modal__overlay" @click.self="$emit('close')">
      <div class="app-modal__sheet" role="dialog" aria-modal="true">
        <header class="app-modal__header">
          <h2 class="app-modal__title">{{ title }}</h2>
          <button class="app-modal__close" type="button" aria-label="Close" @click="$emit('close')">
            &times;
          </button>
        </header>
        <div class="app-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.app-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.app-modal__sheet {
  background: var(--color-surface, #fff);
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 16px 16px 0 0;
  padding: 1.25rem;
}

@media (min-width: 640px) {
  .app-modal__overlay {
    align-items: center;
  }

  .app-modal__sheet {
    border-radius: 16px;
  }
}

.app-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.app-modal__title {
  font-size: 1.1rem;
}

.app-modal__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
}
</style>
