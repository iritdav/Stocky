import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/services/firebase'

function foodItemsCollection(uid) {
  return collection(db, 'users', uid, 'foodItems')
}

export async function listFoodItems(uid) {
  const snapshot = await getDocs(query(foodItemsCollection(uid), orderBy('name')))
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
}

export async function createFoodItem(uid, { name, caloriesPerServing }) {
  const docRef = await addDoc(foodItemsCollection(uid), {
    name,
    caloriesPerServing,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export function updateFoodItem(uid, itemId, data) {
  return updateDoc(doc(db, 'users', uid, 'foodItems', itemId), data)
}

export function deleteFoodItem(uid, itemId) {
  return deleteDoc(doc(db, 'users', uid, 'foodItems', itemId))
}
