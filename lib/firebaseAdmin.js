import { cert, getApps, getApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

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
