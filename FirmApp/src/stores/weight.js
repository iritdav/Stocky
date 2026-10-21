import { defineStore } from 'pinia'
import { addWeightEntry, deleteWeightEntry, listWeightEntries } from '@/services/weightEntries'
import { addDays, todayLocal } from '@/utils/date'

export const useWeightStore = defineStore('weight', {
  state: () => ({
    entries: [],
    loading: false,
  }),
  getters: {
    entriesWithinDays: (state) => (days) => {
      const cutoff = addDays(todayLocal(), -days)
      return state.entries.filter((entry) => entry.date >= cutoff)
    },
  },
  actions: {
    async loadEntries(uid) {
      this.loading = true
      try {
        this.entries = await listWeightEntries(uid)
      } finally {
        this.loading = false
      }
    },
    async logWeight(uid, { date, weightValue }) {
      const id = await addWeightEntry(uid, { date, weightValue })
      this.entries.unshift({ id, date, weightValue })
      this.entries.sort((a, b) => (a.date < b.date ? 1 : -1))
    },
    async removeEntry(uid, entryId) {
      await deleteWeightEntry(uid, entryId)
      this.entries = this.entries.filter((entry) => entry.id !== entryId)
    },
  },
})
