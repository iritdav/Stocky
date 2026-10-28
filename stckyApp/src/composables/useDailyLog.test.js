import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDailyLog } from './useDailyLog'

vi.mock('@/services/entries', () => ({
  addEntry: vi.fn(),
  deleteEntry: vi.fn(),
  listEntriesForDate: vi.fn(),
  updateEntry: vi.fn(),
}))

import { addEntry, deleteEntry, listEntriesForDate, updateEntry } from '@/services/entries'
import { useAuthStore } from '@/stores/auth'
import { useDailyLogStore } from '@/stores/dailyLog'
import { formatDate } from '@/utils/date'

const UID = 'uid-1'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  useAuthStore().user = { uid: UID }
})

describe('useDailyLog', () => {
  it('exposes the store date, formatted date, and derived totals', () => {
    const store = useDailyLogStore()
    store.date = '2026-01-10'
    store.entries = [{ id: '1', meal: 'breakfast', calories: 100 }]

    const { date, formattedDate, totalCalories, entriesByMeal } = useDailyLog()

    expect(date.value).toBe('2026-01-10')
    expect(formattedDate.value).toBe(formatDate('2026-01-10'))
    expect(totalCalories.value).toBe(100)
    expect(entriesByMeal.value.breakfast).toHaveLength(1)
  })

  it('loadForDate loads for the current user', async () => {
    listEntriesForDate.mockResolvedValue([])

    await useDailyLog().loadForDate('2026-01-10')

    expect(listEntriesForDate).toHaveBeenCalledWith(UID, '2026-01-10')
  })

  it('goToPreviousDay / goToNextDay navigate for the current user', async () => {
    listEntriesForDate.mockResolvedValue([])
    await useDailyLog().loadForDate('2026-01-10')

    await useDailyLog().goToPreviousDay()
    expect(listEntriesForDate).toHaveBeenLastCalledWith(UID, '2026-01-09')

    await useDailyLog().goToNextDay()
    expect(listEntriesForDate).toHaveBeenLastCalledWith(UID, '2026-01-10')
  })

  it('logEntry logs for the current user', async () => {
    addEntry.mockResolvedValue('entry-1')
    const store = useDailyLogStore()

    await useDailyLog().logEntry({
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
  })

  it('updateEntryQuantity updates for the current user', async () => {
    const store = useDailyLogStore()
    store.entries = [
      { id: '1', meal: 'lunch', name: 'Rice', caloriesPerServing: 200, quantity: 1, calories: 200 },
    ]

    await useDailyLog().updateEntryQuantity('1', 2)

    expect(updateEntry).toHaveBeenCalledWith(UID, '1', { quantity: 2, calories: 400 })
    expect(store.entries[0].calories).toBe(400)
  })

  it('removeEntry deletes for the current user', async () => {
    const store = useDailyLogStore()
    store.entries = [{ id: '1', calories: 100 }]

    await useDailyLog().removeEntry('1')

    expect(deleteEntry).toHaveBeenCalledWith(UID, '1')
    expect(store.entries).toEqual([])
  })
})
