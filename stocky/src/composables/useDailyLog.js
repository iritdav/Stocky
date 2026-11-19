import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDailyLogStore } from '@/stores/dailyLog'
import { formatDate } from '@/utils/date'

export function useDailyLog() {
  const authStore = useAuthStore()
  const store = useDailyLogStore()

  const uid = () => authStore.user.uid

  return {
    date: computed(() => store.date),
    formattedDate: computed(() => formatDate(store.date)),
    entriesByMeal: computed(() => store.entriesByMeal),
    totalCalories: computed(() => store.totalCalories),
    loading: computed(() => store.loading),
    loadForDate: (date) => store.loadForDate(uid(), date),
    goToPreviousDay: () => store.goToPreviousDay(uid()),
    goToNextDay: () => store.goToNextDay(uid()),
    logEntry: (entry) => store.logEntry(uid(), entry),
    updateEntryQuantity: (entryId, quantity) => store.updateEntryQuantity(uid(), entryId, quantity),
    removeEntry: (entryId) => store.removeEntry(uid(), entryId),
  }
}
