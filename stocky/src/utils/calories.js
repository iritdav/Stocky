export function computeCalories(caloriesPerServing, quantity) {
  return Math.round(caloriesPerServing * quantity)
}

const ACTIVITY_MULTIPLIER = 1.55 // fixed moderate-activity assumption (3-5 workouts/week)
const KCAL_PER_KG = 7700

export function computeBmr({ gender, age, heightCm, weightKg }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'female' ? base - 161 : base + 5
}

export function computeMaintenanceCalories({ gender, age, heightCm, weightKg }) {
  return computeBmr({ gender, age, heightCm, weightKg }) * ACTIVITY_MULTIPLIER
}

export function computeGoalCalories({ gender, age, heightCm, weightKg, weeklyRateKg }) {
  const maintenance = computeMaintenanceCalories({ gender, age, heightCm, weightKg })
  const dailyDelta = (weeklyRateKg * KCAL_PER_KG) / 7
  return Math.round(maintenance + dailyDelta)
}

export const MEALS = ['breakfast', 'lunch', 'dinner', 'snack']

export const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
}
