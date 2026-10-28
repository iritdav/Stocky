import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFoodLibraryStore } from '@/stores/foodLibrary'

export function useFoodLibrary() {
  const authStore = useAuthStore()
  const store = useFoodLibraryStore()

  const uid = () => authStore.user.uid

  return {
    items: computed(() => store.items),
    loading: computed(() => store.loading),
    loaded: computed(() => store.loaded),
    search: (term) => store.filteredItems(term),
    loadItems: () => store.loadItems(uid()),
    addItem: (data) => store.addItem(uid(), data),
    editItem: (itemId, data) => store.editItem(uid(), itemId, data),
    removeItem: (itemId) => store.removeItem(uid(), itemId),
  }
}
