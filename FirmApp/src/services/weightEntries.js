import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/services/firebase'

function weightEntriesCollection(uid) {
  return collection(db, 'users', uid, 'weightEntries')
}

export async function listWeightEntries(uid) {
  const snapshot = await getDocs(query(weightEntriesCollection(uid), orderBy('date', 'desc')))
  return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
}

export async function addWeightEntry(uid, { date, weightValue }) {
  const docRef = await addDoc(weightEntriesCollection(uid), {
    date,
    weightValue,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}

export function deleteWeightEntry(uid, entryId) {
  return deleteDoc(doc(db, 'users', uid, 'weightEntries', entryId))
}
