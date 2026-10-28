import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWeightStore } from './weight'
import { addDays, todayLocal } from '@/utils/date'

vi.mock('@/services/weightEntries', () => ({
  addWeightEntry: vi.fn(),
  deleteWeightEntry: vi.fn(),
  listWeightEntries: vi.fn(),
}))

import { addWeightEntry, deleteWeightEntry, listWeightEntries } from '@/services/weightEntries'

const UID = 'uid-1'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('weight store', () => {
  it('starts with no entries', () => {
    const store = useWeightStore()
    expect(store.entries).toEqual([])
  })

  it('loadEntries populates entries and toggles loading', async () => {
    listWeightEntries.mockResolvedValue([{ id: '1', date: '2026-01-01', weightValue: 70 }])
    const store = useWeightStore()

    const promise = store.loadEntries(UID)
    expect(store.loading).toBe(true)
    await promise

    expect(listWeightEntries).toHaveBeenCalledWith(UID)
    expect(store.entries).toHaveLength(1)
    expect(store.loading).toBe(false)
  })

  it('entriesWithinDays filters out entries older than the cutoff', () => {
    const store = useWeightStore()
    const today = todayLocal()
    store.entries = [
      { id: '1', date: today, weightValue: 70 },
      { id: '2', date: addDays(today, -10), weightValue: 71 },
      { id: '3', date: addDays(today, -40), weightValue: 72 },
    ]

    const within30 = store.entriesWithinDays(30)

    expect(within30.map((entry) => entry.id)).toEqual(['1', '2'])
  })

  it('logWeight adds via the service and keeps entries sorted most-recent-first', async () => {
    addWeightEntry.mockResolvedValue('entry-1')
    const store = useWeightStore()
    store.entries = [{ id: 'old', date: '2026-01-01', weightValue: 71 }]

    await store.logWeight(UID, { date: '2026-01-10', weightValue: 70 })

    expect(addWeightEntry).toHaveBeenCalledWith(UID, { date: '2026-01-10', weightValue: 70 })
    expect(store.entries.map((entry) => entry.id)).toEqual(['entry-1', 'old'])
  })

  it('removeEntry deletes via the service and drops it from state', async () => {
    const store = useWeightStore()
    store.entries = [
      { id: '1', date: '2026-01-01', weightValue: 70 },
      { id: '2', date: '2026-01-02', weightValue: 69 },
    ]

    await store.removeEntry(UID, '1')

    expect(deleteWeightEntry).toHaveBeenCalledWith(UID, '1')
    expect(store.entries).toEqual([{ id: '2', date: '2026-01-02', weightValue: 69 }])
  })
})
