import { defineStore } from 'pinia'
import { onAuthChange, signIn, signInWithGoogle, signOutUser, signUp } from '@/services/auth'
import {
  completeOnboarding,
  createProfile,
  getProfile,
  updateCalorieGoal,
} from '@/services/userProfile'

const DEFAULT_CALORIE_GOAL = 2000

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    ready: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    dailyCalorieGoal: (state) => state.profile?.dailyCalorieGoal ?? 0,
    needsOnboarding: (state) => Boolean(state.user) && !state.profile?.onboarded,
  },
  actions: {
    waitForReady() {
      if (this.ready) return Promise.resolve()
      return new Promise((resolve) => {
        const unsubscribe = onAuthChange(async (user) => {
          unsubscribe()
          this.user = user
          this.profile = user ? await getProfile(user.uid) : null
          this.ready = true
          resolve()
        })
      })
    },
    async login(email, password) {
      const user = await signIn(email, password)
      this.user = user
      this.profile = await getProfile(user.uid)
    },
    async register(email, password) {
      const user = await signUp(email, password)
      this.user = user
      await createProfile(user.uid, {
        displayName: email,
        dailyCalorieGoal: DEFAULT_CALORIE_GOAL,
      })
      this.profile = {
        displayName: email,
        dailyCalorieGoal: DEFAULT_CALORIE_GOAL,
        onboarded: false,
      }
    },
    async loginWithGoogle() {
      const user = await signInWithGoogle()
      this.user = user
      let profile = await getProfile(user.uid)
      if (!profile) {
        await createProfile(user.uid, {
          displayName: user.displayName || user.email,
          dailyCalorieGoal: DEFAULT_CALORIE_GOAL,
        })
        profile = {
          displayName: user.displayName || user.email,
          dailyCalorieGoal: DEFAULT_CALORIE_GOAL,
          onboarded: false,
        }
      }
      this.profile = profile
    },
    async logout() {
      await signOutUser()
      this.user = null
      this.profile = null
    },
    async updateGoal(dailyCalorieGoal) {
      await updateCalorieGoal(this.user.uid, dailyCalorieGoal)
      this.profile = { ...this.profile, dailyCalorieGoal }
    },
    async finishOnboarding(details) {
      await completeOnboarding(this.user.uid, details)
      this.profile = { ...this.profile, ...details, onboarded: true }
    },
  },
})
