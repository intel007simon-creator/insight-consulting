import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// firebaseConfig 값(환경변수)이 채워지면 자동으로 Firestore를 사용합니다.
export const firebaseEnabled = Boolean(config.projectId && config.apiKey)

export function getDb() {
  if (!firebaseEnabled) return null
  const app = getApps().length ? getApp() : initializeApp(config)
  return getFirestore(app)
}
