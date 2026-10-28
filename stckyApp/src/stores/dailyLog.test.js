import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDailyLogStore } from './dailyLog'

vi.mock('@/services/entries', () => ({
  addEntry: vi.fn(),
  deleteEntry: vi.fn(),
  listEntriesForDate: vi.fn(),
  updateEntry: vi.fn(),
}))

import { addEntry, deleteEntry, listEntriesForDate, updateEntry } from '@/services/entries'

const UID = 'uid-1'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('dailyLog store', () => {
  it('defaults to today and empty entries', () => {
    const store = useDailyLogStore()
    expect(store.entries).toEqual([])
    expect(store.totalCalories).toBe(0)
  })

  it('groups entries by meal', () => {
    const store = useDailyLogStore()
    store.entries = [
      { id: '1', meal: 'breakfast', calories: 100 },
      { id: '2', meal: 'dinner', calories: 300 },
      { id: '3', meal: 'breakfast', calories: 50 },
    ]
    expect(store.entriesByMeal.breakfast).toHaveLength(2)
    expect(store.entriesByMeal.dinner).toHaveLength(1)
    expect(store.entriesByMeal.lunch).toEqual([])
    expect(store.entriesByMeal.snack).toEqual([])
  })

  it('sums total calories across all entries', () => {
    const store = useDailyLogStore()
    store.entries = [
      { id: '1', meal: 'breakfast', calories: 100 },
      { id: '2', meal: 'dinner', calories: 300 },
    ]
    expect(store.totalCalories).toBe(400)
  })

  it('loads entries for a date and updates loading state', async () => {
    listEntriesForDate.mockResolvedValue([{ id: '1', meal: 'lunch', calories: 200 }])
    const store = useDailyLogStore()

    const promise = store.loadForDate(UID, '2026-01-10')
    expect(store.loading).toBe(true)
    await promise

    expect(listEntriesForDate).toHaveBeenCalledWith(UID, '2026-01-10')
    expect(store.date).toBe('2026-01-10')
    expect(store.entries).toHaveLength(1)
    expect(store.loading).toBe(false)
  })

  it('goToPreviousDay / goToNextDay navigate relative to the current date', async () => {
    listEntriesForDate.mockResolvedValue([])
    const store = useDailyLogStore()
    await store.loadForDate(UID, '2026-01-10')

    await store.goToPreviousDay(UID)
    expect(listEntriesForDate).toHaveBeenLastCalledWith(UID, '2026-01-09')

    await store.goToNextDay(UID)
    expect(listEntriesForDate).toHaveBeenLastCalledWith(UID, '2026-01-10')
  })

  it('logEntry computes calories and appends the entry using the service id', async () => {
    addEntry.mockResolvedValue('entry-1')
    const store = useDailyLogStore()

    await store.logEntry(UID, {
      meal: 'lunch',
      name: 'Rice',
      caloriesPerServing: 200,
      quantity: 1.5,
    })

    expect(addEntry).toHaveBeenCalledWith(
      UID,
      expect.objectContaining({ meal: 'lunch', name: 'Rice', calories: 300 }),
    )
    expect(store.entries).toHaveLength(1)
    expect(store.entries[0]).toMatchObject({ id: 'entry-1', calories: 300 })
  })

  it('updateEntryQuantity recomputes calories for the matching entry only', async () => {
    const store = useDailyLogStore()
    store.entries = [
      { id: '1', meal: 'lunch', name: 'Rice', caloriesPerServing: 200, quantity: 1, calories: 200 },
      { id: '2', meal: 'dinner', name: 'Soup', caloriesPerServing: 80, quantity: 1, calories: 80 },
    ]

    await store.updateEntryQuantity(UID, '1', 2)

    expect(updateEntry).toHaveBeenCalledWith(UID, '1', { quantity: 2, calories: 400 })
    expect(store.entries[0].calories).toBe(400)
    expect(store.entries[1].calories).toBe(80)
  })

  it('updateEntryQuantity is a no-op for an unknown entry id', async () => {
    const store = useDailyLogStore()
    store.entries = [{ id: '1', calories: 100, caloriesPerServing: 100, quantity: 1 }]

    await store.updateEntryQuantity(UID, 'missing', 3)

    expect(updateEntry).not.toHaveBeenCalled()
  })

  it('removeEntry deletes via the service and drops it from state', async () => {
    const store = useDailyLogStore()
    store.entries = [
      { id: '1', calories: 100 },
      { id: '2', calories: 200 },
    ]

    await store.removeEntry(UID, '1')

    expect(deleteEntry).toHaveBeenCalledWith(UID, '1')
    expect(store.entries).toEqual([{ id: '2', calories: 200 }])
  })
})
