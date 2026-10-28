import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWeightStore } from '@/stores/weight'

export function useWeightEntries() {
  const authStore = useAuthStore()
  const store = useWeightStore()

  const uid = () => authStore.user.uid

  return {
    entries: computed(() => store.entries),
    loading: computed(() => store.loading),
    entriesWithinDays: (days) => store.entriesWithinDays(days),
    loadEntries: () => store.loadEntries(uid()),
    logWeight: (data) => store.logWeight(uid(), data),
    removeEntry: (entryId) => store.removeEntry(uid(), entryId),
  }
}
