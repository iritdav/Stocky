import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
      meta: { guest: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/OnboardingView.vue'),
    },
    {
      path: '/',
      name: 'daily-log',
      component: () => import('@/views/DailyLogView.vue'),
    },
    {
      path: '/library',
      name: 'food-library',
      component: () => import('@/views/FoodLibraryView.vue'),
    },
    {
      path: '/log-food',
      name: 'log-food',
      component: () => import('@/views/LogFoodView.vue'),
    },
    {
      path: '/weight',
      name: 'weight-tracker',
      component: () => import('@/views/WeightTrackerView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!to.meta.guest && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta.guest && authStore.isAuthenticated) {
    return { name: 'daily-log' }
  }
  if (authStore.isAuthenticated && authStore.needsOnboarding && to.name !== 'onboarding') {
    return { name: 'onboarding' }
  }
})

export default router
