import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()

  return {
    user: computed(() => store.user),
    profile: computed(() => store.profile),
    isAuthenticated: computed(() => store.isAuthenticated),
    dailyCalorieGoal: computed(() => store.dailyCalorieGoal),
    needsOnboarding: computed(() => store.needsOnboarding),
    waitForReady: () => store.waitForReady(),
    login: (email, password) => store.login(email, password),
    register: (email, password) => store.register(email, password),
    loginWithGoogle: () => store.loginWithGoogle(),
    logout: () => store.logout(),
    updateGoal: (goal) => store.updateGoal(goal),
    finishOnboarding: (details) => store.finishOnboarding(details),
  }
}
