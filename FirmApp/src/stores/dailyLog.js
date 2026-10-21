import { defineStore } from 'pinia'
import { addEntry, deleteEntry, listEntriesForDate, updateEntry } from '@/services/entries'
import { computeCalories, MEALS } from '@/utils/calories'
import { addDays, todayLocal } from '@/utils/date'

export const useDailyLogStore = defineStore('dailyLog', {
  state: () => ({
    date: todayLocal(),
    entries: [],
    loading: false,
  }),
  getters: {
    entriesByMeal: (state) => {
      const grouped = Object.fromEntries(MEALS.map((meal) => [meal, []]))
      for (const entry of state.entries) {
        grouped[entry.meal]?.push(entry)
      }
      return grouped
    },
    totalCalories: (state) => state.entries.reduce((sum, entry) => sum + entry.calories, 0),
  },
  actions: {
    async loadForDate(uid, date) {
      this.date = date
      this.loading = true
      try {
        this.entries = await listEntriesForDate(uid, date)
      } finally {
        this.loading = false
      }
    },
    goToPreviousDay(uid) {
      return this.loadForDate(uid, addDays(this.date, -1))
    },
    goToNextDay(uid) {
      return this.loadForDate(uid, addDays(this.date, 1))
    },
    async logEntry(uid, { meal, name, caloriesPerServing, quantity, foodItemId = null }) {
      const calories = computeCalories(caloriesPerServing, quantity)
      const id = await addEntry(uid, {
        date: this.date,
        meal,
        name,
        caloriesPerServing,
        quantity,
        calories,
        foodItemId,
      })
      this.entries.push({
        id,
        date: this.date,
        meal,
        name,
        caloriesPerServing,
        quantity,
        calories,
        foodItemId,
      })
    },
    async updateEntryQuantity(uid, entryId, quantity) {
      const entry = this.entries.find((item) => item.id === entryId)
      if (!entry) return
      const calories = computeCalories(entry.caloriesPerServing, quantity)
      await updateEntry(uid, entryId, { quantity, calories })
      entry.quantity = quantity
      entry.calories = calories
    },
    async removeEntry(uid, entryId) {
      await deleteEntry(uid, entryId)
      this.entries = this.entries.filter((entry) => entry.id !== entryId)
    },
  },
})
