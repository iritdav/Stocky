import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from './auth'

vi.mock('@/services/auth', () => ({
  onAuthChange: vi.fn(),
  signIn: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOutUser: vi.fn(),
  signUp: vi.fn(),
}))

vi.mock('@/services/userProfile', () => ({
  completeOnboarding: vi.fn(),
  createProfile: vi.fn(),
  getProfile: vi.fn(),
  updateCalorieGoal: vi.fn(),
}))

import { onAuthChange, signIn, signInWithGoogle, signOutUser, signUp } from '@/services/auth'
import {
  completeOnboarding,
  createProfile,
  getProfile,
  updateCalorieGoal,
} from '@/services/userProfile'

const USER = { uid: 'uid-1', email: 'test@example.com' }

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('auth store', () => {
  it('starts unauthenticated and not ready', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.ready).toBe(false)
  })

  it('dailyCalorieGoal falls back to 0 with no profile', () => {
    const store = useAuthStore()
    expect(store.dailyCalorieGoal).toBe(0)
  })

  it('needsOnboarding is false when signed out', () => {
    const store = useAuthStore()
    expect(store.needsOnboarding).toBe(false)
  })

  it('needsOnboarding is true for a signed-in user without an onboarded profile', () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { onboarded: false }
    expect(store.needsOnboarding).toBe(true)
  })

  it('needsOnboarding is false once the profile is onboarded', () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { onboarded: true }
    expect(store.needsOnboarding).toBe(false)
  })

  it('waitForReady resolves with user/profile from the auth-change callback', async () => {
    getProfile.mockResolvedValue({ dailyCalorieGoal: 1800, onboarded: true })
    onAuthChange.mockImplementation((callback) => {
      callback(USER)
      return vi.fn()
    })
    const store = useAuthStore()

    await store.waitForReady()

    expect(store.user).toEqual(USER)
    expect(store.profile).toEqual({ dailyCalorieGoal: 1800, onboarded: true })
    expect(store.ready).toBe(true)
  })

  it('waitForReady resolves immediately if already ready', async () => {
    getProfile.mockResolvedValue(null)
    onAuthChange.mockImplementation((callback) => {
      callback(null)
      return vi.fn()
    })
    const store = useAuthStore()
    await store.waitForReady()
    onAuthChange.mockClear()

    await store.waitForReady()

    expect(onAuthChange).not.toHaveBeenCalled()
  })

  it('login signs in and loads the profile', async () => {
    signIn.mockResolvedValue(USER)
    getProfile.mockResolvedValue({ dailyCalorieGoal: 2200, onboarded: true })
    const store = useAuthStore()

    await store.login('test@example.com', 'secret')

    expect(signIn).toHaveBeenCalledWith('test@example.com', 'secret')
    expect(store.user).toEqual(USER)
    expect(store.profile).toEqual({ dailyCalorieGoal: 2200, onboarded: true })
  })

  it('register creates an unonboarded profile with the default calorie goal', async () => {
    signUp.mockResolvedValue(USER)
    const store = useAuthStore()

    await store.register('test@example.com', 'secret')

    expect(signUp).toHaveBeenCalledWith('test@example.com', 'secret')
    expect(createProfile).toHaveBeenCalledWith(USER.uid, {
      displayName: 'test@example.com',
      dailyCalorieGoal: 2000,
    })
    expect(store.profile).toMatchObject({ dailyCalorieGoal: 2000, onboarded: false })
  })

  it('loginWithGoogle creates a profile for a first-time Google user', async () => {
    signInWithGoogle.mockResolvedValue({ ...USER, displayName: 'Dave' })
    getProfile.mockResolvedValue(null)
    const store = useAuthStore()

    await store.loginWithGoogle()

    expect(createProfile).toHaveBeenCalledWith(USER.uid, {
      displayName: 'Dave',
      dailyCalorieGoal: 2000,
    })
    expect(store.profile).toMatchObject({ onboarded: false })
  })

  it('loginWithGoogle reuses an existing profile for a returning Google user', async () => {
    signInWithGoogle.mockResolvedValue(USER)
    getProfile.mockResolvedValue({ dailyCalorieGoal: 1900, onboarded: true })
    const store = useAuthStore()

    await store.loginWithGoogle()

    expect(createProfile).not.toHaveBeenCalled()
    expect(store.profile).toEqual({ dailyCalorieGoal: 1900, onboarded: true })
  })

  it('logout clears user and profile', async () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { onboarded: true }

    await store.logout()

    expect(signOutUser).toHaveBeenCalled()
    expect(store.user).toBeNull()
    expect(store.profile).toBeNull()
  })

  it('updateGoal persists via the service and updates local profile', async () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { dailyCalorieGoal: 2000, onboarded: true }

    await store.updateGoal(1700)

    expect(updateCalorieGoal).toHaveBeenCalledWith(USER.uid, 1700)
    expect(store.profile.dailyCalorieGoal).toBe(1700)
  })

  it('finishOnboarding persists details and marks the profile onboarded', async () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { onboarded: false }
    const details = {
      gender: 'female',
      age: 30,
      heightCm: 165,
      weightKg: 60,
      weeklyRateKg: -0.5,
      dailyCalorieGoal: 1700,
    }

    await store.finishOnboarding(details)

    expect(completeOnboarding).toHaveBeenCalledWith(USER.uid, details)
    expect(store.profile).toMatchObject({ ...details, onboarded: true })
    expect(store.needsOnboarding).toBe(false)
  })
})
