import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFoodLibraryStore } from './foodLibrary'

vi.mock('@/services/foodItems', () => ({
  createFoodItem: vi.fn(),
  deleteFoodItem: vi.fn(),
  listFoodItems: vi.fn(),
  updateFoodItem: vi.fn(),
}))

import { createFoodItem, deleteFoodItem, listFoodItems, updateFoodItem } from '@/services/foodItems'

const UID = 'uid-1'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('foodLibrary store', () => {
  it('starts empty and not yet loaded', () => {
    const store = useFoodLibraryStore()
    expect(store.items).toEqual([])
    expect(store.loaded).toBe(false)
  })

  it('loadItems populates items and flips loaded/loading flags', async () => {
    listFoodItems.mockResolvedValue([{ id: '1', name: 'Rice', caloriesPerServing: 200 }])
    const store = useFoodLibraryStore()

    const promise = store.loadItems(UID)
    expect(store.loading).toBe(true)
    await promise

    expect(listFoodItems).toHaveBeenCalledWith(UID)
    expect(store.items).toHaveLength(1)
    expect(store.loaded).toBe(true)
    expect(store.loading).toBe(false)
  })

  it('filteredItems returns everything for a blank search', () => {
    const store = useFoodLibraryStore()
    store.items = [
      { id: '1', name: 'Rice' },
      { id: '2', name: 'Chicken' },
    ]
    expect(store.filteredItems('   ')).toHaveLength(2)
  })

  it('filteredItems matches case-insensitively by substring', () => {
    const store = useFoodLibraryStore()
    store.items = [
      { id: '1', name: 'Grilled Chicken' },
      { id: '2', name: 'Rice' },
    ]
    expect(store.filteredItems('chick')).toEqual([{ id: '1', name: 'Grilled Chicken' }])
  })

  it('addItem creates via the service and appends the new item with its id', async () => {
    createFoodItem.mockResolvedValue('item-1')
    const store = useFoodLibraryStore()

    const result = await store.addItem(UID, { name: 'Rice', caloriesPerServing: 200 })

    expect(createFoodItem).toHaveBeenCalledWith(UID, { name: 'Rice', caloriesPerServing: 200 })
    expect(result).toEqual({ id: 'item-1', name: 'Rice', caloriesPerServing: 200 })
    expect(store.items).toContainEqual({ id: 'item-1', name: 'Rice', caloriesPerServing: 200 })
  })

  it('editItem updates via the service and merges changes into matching item', async () => {
    const store = useFoodLibraryStore()
    store.items = [{ id: '1', name: 'Rice', caloriesPerServing: 200 }]

    await store.editItem(UID, '1', { caloriesPerServing: 220 })

    expect(updateFoodItem).toHaveBeenCalledWith(UID, '1', { caloriesPerServing: 220 })
    expect(store.items[0]).toEqual({ id: '1', name: 'Rice', caloriesPerServing: 220 })
  })

  it('removeItem deletes via the service and drops it from state', async () => {
    const store = useFoodLibraryStore()
    store.items = [
      { id: '1', name: 'Rice' },
      { id: '2', name: 'Chicken' },
    ]

    await store.removeItem(UID, '1')

    expect(deleteFoodItem).toHaveBeenCalledWith(UID, '1')
    expect(store.items).toEqual([{ id: '2', name: 'Chicken' }])
  })
})
