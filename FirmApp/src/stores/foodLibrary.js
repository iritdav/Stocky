import { defineStore } from 'pinia'
import { createFoodItem, deleteFoodItem, listFoodItems, updateFoodItem } from '@/services/foodItems'

export const useFoodLibraryStore = defineStore('foodLibrary', {
  state: () => ({
    items: [],
    loading: false,
    loaded: false,
  }),
  getters: {
    filteredItems: (state) => (search) => {
      const term = search.trim().toLowerCase()
      if (!term) return state.items
      return state.items.filter((item) => item.name.toLowerCase().includes(term))
    },
  },
  actions: {
    async loadItems(uid) {
      this.loading = true
      try {
        this.items = await listFoodItems(uid)
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    async addItem(uid, { name, caloriesPerServing }) {
      const id = await createFoodItem(uid, { name, caloriesPerServing })
      const item = { id, name, caloriesPerServing }
      this.items.push(item)
      return item
    },
    async editItem(uid, itemId, data) {
      await updateFoodItem(uid, itemId, data)
      const item = this.items.find((entry) => entry.id === itemId)
      if (item) Object.assign(item, data)
    },
    async removeItem(uid, itemId) {
      await deleteFoodItem(uid, itemId)
      this.items = this.items.filter((item) => item.id !== itemId)
    },
  },
})
