<script setup>
defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
  label: { type: String, default: '' },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="app-slider">
    <span v-if="label" class="app-slider__label">{{ label }}</span>
    <input
      type="range"
      class="app-slider__input"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', Number($event.target.value))"
    />
    <div class="app-slider__scale">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
.app-slider {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.app-slider__label {
  font-size: 0.85rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
}

.app-slider__input {
  width: 100%;
  accent-color: var(--color-primary, #2f9e67);
}

.app-slider__scale {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.5));
}
</style>
