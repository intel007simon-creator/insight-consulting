import { NextResponse } from 'next/server'
import { getAdminAuth } from '@/lib/firebaseAdmin'

export const runtime = 'nodejs'

// Simple ID/password gate, independent of the Firebase console's own user list.
// ADMIN_USERNAME / ADMIN_PASSWORD are checked here; on match we mint a Firebase
// custom token for a fixed admin UID so the existing client Firestore writes
// (which require request.auth != null) keep working unchanged.
export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const { username, password } = body || {}
  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD

  if (!expectedUser || !expectedPass) {
    return NextResponse.json(
      { error: '서버에 관리자 계정(ADMIN_USERNAME / ADMIN_PASSWORD)이 설정되지 않았습니다.' },
      { status: 500 }
    )
  }
  if (username !== expectedUser || password !== expectedPass) {
    return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const adminAuth = getAdminAuth()
  if (!adminAuth) {
    return NextResponse.json(
      { error: '서버에 FIREBASE_SERVICE_ACCOUNT_KEY가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  try {
    const token = await adminAuth.createCustomToken('site-admin')
    return NextResponse.json({ token })
  } catch (e) {
    return NextResponse.json({ error: '토큰 발급 실패: ' + (e.message || String(e)) }, { status: 500 })
  }
}
