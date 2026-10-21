import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/services/firebase'

function entriesCollection(uid) {
  return collection(db, 'users', uid, 'entries')
}

export async function listEntriesForDate(uid, date) {
  const snapshot = await getDocs(query(entriesCollection(uid), where('date', '==', date)))
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
}

export async function addEntry(uid, entryData) {
  const docRef = await addDoc(entriesCollection(uid), {
    ...entryData,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export function updateEntry(uid, entryId, data) {
  return updateDoc(doc(db, 'users', uid, 'entries', entryId), data)
}

export function deleteEntry(uid, entryId) {
  return deleteDoc(doc(db, 'users', uid, 'entries', entryId))
}
