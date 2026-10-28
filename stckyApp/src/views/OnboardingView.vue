<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSlider from '@/components/ui/AppSlider.vue'
import { useAuth } from '@/composables/useAuth'
import { computeGoalCalories } from '@/utils/calories'

const auth = useAuth()
const router = useRouter()
const profile = auth.profile.value

const gender = ref(profile?.gender ?? 'female')
const age = ref(profile?.age ?? '')
const heightCm = ref(profile?.heightCm ?? '')
const weightKg = ref(profile?.weightKg ?? '')
const weeklyRateKg = ref(profile?.weeklyRateKg ?? 0)
const error = ref('')
const submitting = ref(false)

const detailsComplete = computed(() => age.value && heightCm.value && weightKg.value)

const goalCalories = computed(() => {
  if (!detailsComplete.value) return null
  return computeGoalCalories({
    gender: gender.value,
    age: Number(age.value),
    heightCm: Number(heightCm.value),
    weightKg: Number(weightKg.value),
    weeklyRateKg: weeklyRateKg.value,
  })
})

const rateLabel = computed(() => {
  const rate = weeklyRateKg.value
  if (rate === 0) return 'Maintain weight'
  return `${rate > 0 ? 'Gain' : 'Lose'} ${Math.abs(rate).toFixed(2)} kg/week`
})

async function handleSubmit() {
  if (!detailsComplete.value) return
  error.value = ''
  submitting.value = true
  try {
    await auth.finishOnboarding({
      gender: gender.value,
      age: Number(age.value),
      heightCm: Number(heightCm.value),
      weightKg: Number(weightKg.value),
      weeklyRateKg: weeklyRateKg.value,
      dailyCalorieGoal: goalCalories.value,
    })
    router.push({ name: 'daily-log' })
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="onboarding-view">
    <h1 class="onboarding-view__title">Tell us about you</h1>
    <p class="onboarding-view__subtitle">We'll use this to calculate your daily calorie target.</p>

    <form class="onboarding-view__form" @submit.prevent="handleSubmit">
      <label class="onboarding-view__field">
        <span class="onboarding-view__field-label">Gender</span>
        <select v-model="gender" class="onboarding-view__select">
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </label>

      <AppInput v-model="age" type="number" min="13" label="Age (years)" required />
      <AppInput v-model="heightCm" type="number" min="100" label="Height (cm)" required />
      <AppInput v-model="weightKg" type="number" min="30" step="0.1" label="Weight (kg)" required />

      <AppCard class="onboarding-view__goal">
        <AppSlider
          v-model="weeklyRateKg"
          :min="-1"
          :max="1"
          :step="0.25"
          label="Weekly weight-change goal"
        />
        <p class="onboarding-view__rate">{{ rateLabel }}</p>
        <p v-if="goalCalories" class="onboarding-view__calories">
          {{ goalCalories.toLocaleString() }} kcal / day
        </p>
        <p v-else class="onboarding-view__calories onboarding-view__calories--placeholder">
          Fill in age, height and weight to see your daily target
        </p>
      </AppCard>

      <p v-if="error" class="onboarding-view__error">{{ error }}</p>
      <AppButton type="submit" :disabled="submitting || !detailsComplete">Continue</AppButton>
    </form>
  </div>
</template>

<style scoped>
.onboarding-view {
  max-width: 400px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.onboarding-view__title {
  font-size: 1.5rem;
  text-align: center;
}

.onboarding-view__subtitle {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
  margin-top: -0.75rem;
}

.onboarding-view__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.onboarding-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.onboarding-view__field-label {
  font-size: 0.85rem;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.6));
}

.onboarding-view__select {
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-border, rgba(60, 60, 60, 0.2));
  border-radius: 10px;
  background: var(--color-surface, #fff);
  width: 100%;
}

.onboarding-view__goal {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.onboarding-view__rate {
  font-weight: 600;
  text-align: center;
}

.onboarding-view__calories {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-primary, #2f9e67);
}

.onboarding-view__calories--placeholder {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--color-text-muted, rgba(27, 27, 31, 0.5));
}

.onboarding-view__error {
  color: var(--color-danger, #d14343);
  font-size: 0.85rem;
}
</style>
