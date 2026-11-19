import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWeightEntries } from './useWeightEntries'

vi.mock('@/services/weightEntries', () => ({
  addWeightEntry: vi.fn(),
  deleteWeightEntry: vi.fn(),
  listWeightEntries: vi.fn(),
}))

import { addWeightEntry, deleteWeightEntry, listWeightEntries } from '@/services/weightEntries'
import { useAuthStore } from '@/stores/auth'
import { useWeightStore } from '@/stores/weight'
import { addDays, todayLocal } from '@/utils/date'

const UID = 'uid-1'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  useAuthStore().user = { uid: UID }
})

describe('useWeightEntries', () => {
  it('exposes the store entries and loading state', () => {
    const store = useWeightStore()
    store.entries = [{ id: '1', date: todayLocal(), weightValue: 180 }]
    store.loading = true

    const { entries, loading } = useWeightEntries()

    expect(entries.value).toEqual(store.entries)
    expect(loading.value).toBe(true)
  })

  it('entriesWithinDays delegates to the store getter', () => {
    const store = useWeightStore()
    const today = todayLocal()
    store.entries = [
      { id: '1', date: today, weightValue: 180 },
      { id: '2', date: addDays(today, -40), weightValue: 182 },
    ]

    expect(useWeightEntries().entriesWithinDays(30)).toEqual([store.entries[0]])
  })

  it('loadEntries loads for the current user', async () => {
    listWeightEntries.mockResolvedValue([])

    await useWeightEntries().loadEntries()

    expect(listWeightEntries).toHaveBeenCalledWith(UID)
  })

  it('logWeight logs for the current user and prepends the entry', async () => {
    addWeightEntry.mockResolvedValue('entry-1')
    const store = useWeightStore()
    const today = todayLocal()

    await useWeightEntries().logWeight({ date: today, weightValue: 175 })

    expect(addWeightEntry).toHaveBeenCalledWith(UID, { date: today, weightValue: 175 })
    expect(store.entries[0]).toEqual({ id: 'entry-1', date: today, weightValue: 175 })
  })

  it('removeEntry deletes for the current user', async () => {
    const store = useWeightStore()
    store.entries = [{ id: '1', date: todayLocal(), weightValue: 180 }]

    await useWeightEntries().removeEntry('1')

    expect(deleteWeightEntry).toHaveBeenCalledWith(UID, '1')
    expect(store.entries).toEqual([])
  })
})
