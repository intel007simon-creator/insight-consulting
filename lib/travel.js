import { SAMPLE_TRAVEL_POSTS } from './sampleTravel'
import { firebaseEnabled, getDb } from './firebase'

const COLLECTION = 'travel_posts'

async function allTravelPosts() {
  if (firebaseEnabled) {
    try {
      const db = getDb()
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const q = query(collection(db, COLLECTION), where('status', '==', 'published'))
      const snap = await getDocs(q)
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      if (rows.length) return rows
    } catch (e) {
      console.error('[travel] Firestore 읽기 실패, 샘플데이터로 대체:', e?.message)
    }
  }
  return SAMPLE_TRAVEL_POSTS
}

function sortRows(rows) {
  return rows.slice().sort((a, b) => {
    if (!!b.is_featured !== !!a.is_featured) return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
    const byOrder = (a.display_order ?? 999) - (b.display_order ?? 999)
    if (byOrder !== 0) return byOrder
    return new Date(b.published_at || 0) - new Date(a.published_at || 0)
  })
}

export async function getTravelPosts({ limit } = {}) {
  const rows = sortRows(await allTravelPosts())
  return typeof limit === 'number' ? rows.slice(0, limit) : rows
}

// 어드민 전용: 글 관리 목록은 공개 여부와 상관없이 전부 불러옵니다.
export async function getAllTravelPostsForAdmin() {
  if (!firebaseEnabled) return SAMPLE_TRAVEL_POSTS
  const db = getDb()
  const { collection, getDocs } = await import('firebase/firestore')
  const snap = await getDocs(collection(db, COLLECTION))
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  rows.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
  return rows
}

export const TRAVEL_COLLECTION = COLLECTION
