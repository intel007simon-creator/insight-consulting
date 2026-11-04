import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin'

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

  const { username, password, pin } = body || {}

  // 로고 더블클릭 → PIN 로그인. PIN은 코드에 넣지 않고 Vercel 환경변수 ADMIN_PIN에만 둡니다(저장소가 공개라서).
  if (pin !== undefined) {
    const check = await checkPin(String(pin))
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })
    return issueToken()
  }

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

  return issueToken()
}

async function issueToken() {
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

// ---- PIN 로그인 ----
// 4자리 PIN은 경우의 수가 1만 개뿐이라, 틀린 시도가 MAX_FAILS번 쌓이면 LOCK_MINUTES 동안 PIN 로그인을 잠급니다.
// 서버리스 환경에서는 메모리가 요청마다 초기화될 수 있어 시도 횟수는 Firestore(admin_meta/pin_login)에 기록합니다.
// 잠겨 있어도 아이디/비밀번호 로그인(/admin)은 그대로 쓸 수 있습니다.
const MAX_FAILS = 5
const LOCK_MINUTES = 15

function sameSecret(a, b) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

async function checkPin(pin) {
  const expected = process.env.ADMIN_PIN
  if (!expected) return { ok: false, status: 500, error: '서버에 ADMIN_PIN이 설정되지 않았습니다.' }

  const db = getAdminDb()
  if (!db) return { ok: false, status: 500, error: '서버에 FIREBASE_SERVICE_ACCOUNT_KEY가 설정되지 않았습니다.' }
  const ref = db.collection('admin_meta').doc('pin_login')

  try {
    return await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      const d = snap.exists ? snap.data() : {}
      const now = Date.now()
      if (d.lockedUntil && d.lockedUntil > now) {
        const min = Math.ceil((d.lockedUntil - now) / 60000)
        return { ok: false, status: 429, error: `PIN 입력이 여러 번 틀려 잠겼습니다. ${min}분 후 다시 시도해 주세요.` }
      }
      if (sameSecret(pin, expected)) {
        tx.set(ref, { fails: 0, lockedUntil: 0 })
        return { ok: true }
      }
      const fails = (d.lockedUntil && d.lockedUntil <= now ? 0 : d.fails || 0) + 1
      if (fails >= MAX_FAILS) {
        tx.set(ref, { fails: 0, lockedUntil: now + LOCK_MINUTES * 60000 })
        return { ok: false, status: 429, error: `PIN이 ${MAX_FAILS}번 틀려 ${LOCK_MINUTES}분 동안 잠겼습니다.` }
      }
      tx.set(ref, { fails, lockedUntil: 0 })
      return { ok: false, status: 401, error: `PIN이 올바르지 않습니다. (${fails}/${MAX_FAILS})` }
    })
  } catch (e) {
    return { ok: false, status: 500, error: 'PIN 확인 중 오류: ' + (e.message || String(e)) }
  }
}
