import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFoodLibrary } from './useFoodLibrary'

vi.mock('@/services/foodItems', () => ({
  createFoodItem: vi.fn(),
  deleteFoodItem: vi.fn(),
  listFoodItems: vi.fn(),
  updateFoodItem: vi.fn(),
}))

import { createFoodItem, deleteFoodItem, listFoodItems, updateFoodItem } from '@/services/foodItems'
import { useAuthStore } from '@/stores/auth'
import { useFoodLibraryStore } from '@/stores/foodLibrary'

const UID = 'uid-1'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  useAuthStore().user = { uid: UID }
})

describe('useFoodLibrary', () => {
  it('exposes the store items and loading state', () => {
    const store = useFoodLibraryStore()
    store.items = [{ id: '1', name: 'Rice', caloriesPerServing: 200 }]
    store.loading = true

    const { items, loading } = useFoodLibrary()

    expect(items.value).toEqual(store.items)
    expect(loading.value).toBe(true)
  })

  it('search filters items by name via the store getter', () => {
    const store = useFoodLibraryStore()
    store.items = [
      { id: '1', name: 'Rice' },
      { id: '2', name: 'Chicken' },
    ]

    expect(useFoodLibrary().search('ric')).toEqual([{ id: '1', name: 'Rice' }])
  })

  it('loadItems loads for the current user', async () => {
    listFoodItems.mockResolvedValue([])

    await useFoodLibrary().loadItems()

    expect(listFoodItems).toHaveBeenCalledWith(UID)
  })

  it('addItem creates the item for the current user', async () => {
    createFoodItem.mockResolvedValue('item-1')

    const item = await useFoodLibrary().addItem({ name: 'Soup', caloriesPerServing: 80 })

    expect(createFoodItem).toHaveBeenCalledWith(UID, { name: 'Soup', caloriesPerServing: 80 })
    expect(item).toEqual({ id: 'item-1', name: 'Soup', caloriesPerServing: 80 })
  })

  it('editItem updates the item for the current user', async () => {
    const store = useFoodLibraryStore()
    store.items = [{ id: '1', name: 'Rice', caloriesPerServing: 200 }]

    await useFoodLibrary().editItem('1', { caloriesPerServing: 220 })

    expect(updateFoodItem).toHaveBeenCalledWith(UID, '1', { caloriesPerServing: 220 })
    expect(store.items[0].caloriesPerServing).toBe(220)
  })

  it('removeItem deletes the item for the current user', async () => {
    const store = useFoodLibraryStore()
    store.items = [{ id: '1', name: 'Rice' }]

    await useFoodLibrary().removeItem('1')

    expect(deleteFoodItem).toHaveBeenCalledWith(UID, '1')
    expect(store.items).toEqual([])
  })
})
