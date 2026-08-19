import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const config = {
  apiKey: 'AIzaSyBFyUxir2k2MlFNw0wofRlHdW-UmkeP9_E',
  authDomain: 'insightconsulting-homepage.firebaseapp.com',
  projectId: 'insightconsulting-homepage',
  storageBucket: 'insightconsulting-homepage.firebasestorage.app',
  messagingSenderId: '1056327766860',
  appId: '1:1056327766860:web:7ffd05ecf94cbc7d2775e9',
  measurementId: 'G-93KT5HSYHG',
}

export const firebaseEnabled = Boolean(config.projectId && config.apiKey)

function app() {
  return getApps().length ? getApp() : initializeApp(config)
}
export function getDb() {
  if (!firebaseEnabled) return null
  return getFirestore(app())
}
export function getAuthClient() {
  if (!firebaseEnabled) return null
  return getAuth(app())
}
