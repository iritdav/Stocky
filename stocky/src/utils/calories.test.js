import { describe, expect, it } from 'vitest'
import {
  computeBmr,
  computeCalories,
  computeGoalCalories,
  computeMaintenanceCalories,
} from './calories'

describe('computeCalories', () => {
  it('multiplies calories per serving by quantity', () => {
    expect(computeCalories(200, 1.5)).toBe(300)
  })

  it('rounds to the nearest whole calorie', () => {
    expect(computeCalories(100, 1.333)).toBe(133)
  })

  it('handles zero quantity', () => {
    expect(computeCalories(250, 0)).toBe(0)
  })
})

describe('computeBmr', () => {
  it('matches Mifflin-St Jeor for a male profile', () => {
    const bmr = computeBmr({ gender: 'male', age: 30, heightCm: 180, weightKg: 80 })
    expect(bmr).toBe(10 * 80 + 6.25 * 180 - 5 * 30 + 5)
  })

  it('matches Mifflin-St Jeor for a female profile', () => {
    const bmr = computeBmr({ gender: 'female', age: 30, heightCm: 165, weightKg: 60 })
    expect(bmr).toBe(10 * 60 + 6.25 * 165 - 5 * 30 - 161)
  })

  it('treats any non-female gender as the male formula', () => {
    const male = computeBmr({ gender: 'male', age: 25, heightCm: 170, weightKg: 70 })
    const other = computeBmr({ gender: 'nonbinary', age: 25, heightCm: 170, weightKg: 70 })
    expect(other).toBe(male)
  })
})

describe('computeMaintenanceCalories', () => {
  it('applies the fixed moderate-activity multiplier to BMR', () => {
    const profile = { gender: 'male', age: 30, heightCm: 180, weightKg: 80 }
    const bmr = computeBmr(profile)
    expect(computeMaintenanceCalories(profile)).toBeCloseTo(bmr * 1.55)
  })
})

describe('computeGoalCalories', () => {
  const profile = { gender: 'female', age: 28, heightCm: 165, weightKg: 65 }

  it('returns maintenance calories when the weekly rate is zero', () => {
    const maintenance = computeMaintenanceCalories(profile)
    expect(computeGoalCalories({ ...profile, weeklyRateKg: 0 })).toBe(Math.round(maintenance))
  })

  it('lowers the daily target for a weight-loss rate', () => {
    const maintenance = computeGoalCalories({ ...profile, weeklyRateKg: 0 })
    const losing = computeGoalCalories({ ...profile, weeklyRateKg: -0.5 })
    expect(losing).toBeLessThan(maintenance)
  })

  it('raises the daily target for a weight-gain rate', () => {
    const maintenance = computeGoalCalories({ ...profile, weeklyRateKg: 0 })
    const gaining = computeGoalCalories({ ...profile, weeklyRateKg: 0.5 })
    expect(gaining).toBeGreaterThan(maintenance)
  })

  it('applies a 1100 kcal/day delta per 1 kg/week of target rate', () => {
    const base = computeGoalCalories({ ...profile, weeklyRateKg: 0 })
    const halfKg = computeGoalCalories({ ...profile, weeklyRateKg: 0.5 })
    expect(halfKg - base).toBeCloseTo(550, 0)
  })
})
