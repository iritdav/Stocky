import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'

function profileRef(uid) {
  return doc(db, 'users', uid)
}

export async function getProfile(uid) {
  const snapshot = await getDoc(profileRef(uid))
  return snapshot.exists() ? snapshot.data() : null
}

export function createProfile(uid, { displayName, dailyCalorieGoal, onboarded = false }) {
  return setDoc(profileRef(uid), {
    displayName,
    dailyCalorieGoal,
    onboarded,
    createdAt: new Date().toISOString(),
  })
}

export function updateCalorieGoal(uid, dailyCalorieGoal) {
  return updateDoc(profileRef(uid), { dailyCalorieGoal })
}

export function completeOnboarding(
  uid,
  { gender, age, heightCm, weightKg, weeklyRateKg, dailyCalorieGoal },
) {
  return updateDoc(profileRef(uid), {
    gender,
    age,
    heightCm,
    weightKg,
    weeklyRateKg,
    dailyCalorieGoal,
    onboarded: true,
  })
}
