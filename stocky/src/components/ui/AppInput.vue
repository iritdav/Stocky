<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  step: { type: String, default: undefined },
  min: { type: [String, Number], default: undefined },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="app-input">
    <span v-if="label" class="app-input__label">{{ label }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :step="step"
      :min="min"
      class="app-input__field"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.app-input__label {
  font-size: 0.85rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
}

.app-input__field {
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-border, rgba(60, 60, 60, 0.2));
  border-radius: 10px;
  background: var(--color-surface, #fff);
  width: 100%;
}

.app-input__field:focus {
  outline: 2px solid var(--color-primary, #2f9e67);
  outline-offset: 1px;
}
</style>
