import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from './useAuth'

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

import { signIn, signOutUser } from '@/services/auth'
import { completeOnboarding, getProfile, updateCalorieGoal } from '@/services/userProfile'
import { useAuthStore } from '@/stores/auth'

const USER = { uid: 'uid-1', email: 'test@example.com' }

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('useAuth', () => {
  it('exposes the store user, profile, and derived flags', () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { dailyCalorieGoal: 1800, onboarded: false }

    const { user, profile, isAuthenticated, dailyCalorieGoal, needsOnboarding } = useAuth()

    expect(user.value).toEqual(USER)
    expect(profile.value).toEqual({ dailyCalorieGoal: 1800, onboarded: false })
    expect(isAuthenticated.value).toBe(true)
    expect(dailyCalorieGoal.value).toBe(1800)
    expect(needsOnboarding.value).toBe(true)
  })

  it('login delegates to the store with the given credentials', async () => {
    signIn.mockResolvedValue(USER)
    getProfile.mockResolvedValue({ dailyCalorieGoal: 2000, onboarded: true })

    await useAuth().login('test@example.com', 'secret')

    expect(signIn).toHaveBeenCalledWith('test@example.com', 'secret')
  })

  it('logout delegates to the store', async () => {
    const store = useAuthStore()
    store.user = USER

    await useAuth().logout()

    expect(signOutUser).toHaveBeenCalled()
    expect(store.user).toBeNull()
  })

  it('updateGoal uses the current store user as uid', async () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { dailyCalorieGoal: 2000, onboarded: true }

    await useAuth().updateGoal(1700)

    expect(updateCalorieGoal).toHaveBeenCalledWith(USER.uid, 1700)
  })

  it('finishOnboarding uses the current store user as uid', async () => {
    const store = useAuthStore()
    store.user = USER
    store.profile = { onboarded: false }
    const details = { dailyCalorieGoal: 1600 }

    await useAuth().finishOnboarding(details)

    expect(completeOnboarding).toHaveBeenCalledWith(USER.uid, details)
  })
})
