import { cert, getApps, getApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function parseServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function adminApp() {
  if (getApps().length) return getApp()
  const serviceAccount = parseServiceAccount()
  if (!serviceAccount) return null
  return initializeApp({ credential: cert(serviceAccount) })
}

// Server-only. Returns null if FIREBASE_SERVICE_ACCOUNT_KEY isn't configured yet.
export function getAdminAuth() {
  const app = adminApp()
  return app ? getAuth(app) : null
}

// Server-only. 관리자 권한 Firestore (보안 규칙을 거치지 않음). PIN 로그인 잠금 기록 등에 사용.
export function getAdminDb() {
  const app = adminApp()
  return app ? getFirestore(app) : null
}
