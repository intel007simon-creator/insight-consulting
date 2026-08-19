import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// 웹에 공개돼도 안전한 클라이언트 설정값 (보안은 Firestore 규칙이 담당)
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

export function getDb() {
  if (!firebaseEnabled) return null
  const app = getApps().length ? getApp() : initializeApp(config)
  return getFirestore(app)
}
