import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '@/services/firebase'

export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password).then((credential) => credential.user)
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then((credential) => credential.user)
}

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider).then((credential) => credential.user)
}

export function signOutUser() {
  return signOut(auth)
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
