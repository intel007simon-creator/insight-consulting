import { SAMPLE_POSTS } from './samplePosts'
import { firebaseEnabled, getDb } from './firebase'

// Firestore가 연결되면 실데이터, 아니면 샘플데이터를 반환하는 통합 데이터 레이어.
async function allPosts() {
  if (firebaseEnabled) {
    try {
      const db = getDb()
      const { collection, getDocs, query, where } = await import('firebase/firestore')
      const q = query(collection(db, 'posts'), where('status', '==', 'published'))
      const snap = await getDocs(q)
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      if (rows.length) return rows
    } catch (e) {
      console.error('[data] Firestore 읽기 실패, 샘플데이터로 대체:', e?.message)
    }
  }
  return SAMPLE_POSTS
}

const byDateDesc = (a, b) => new Date(b.published_at) - new Date(a.published_at)
const byOrder = (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)

export async function getPosts({ category, corner, tag, home, featured, pinned, sort = 'date', limit } = {}) {
  let posts = await allPosts()
  if (category) posts = posts.filter((p) => p.category === category)
  if (corner) posts = posts.filter((p) => p.corner === corner)
  if (tag) posts = posts.filter((p) => (p.tags || []).includes(tag))
  if (home) posts = posts.filter((p) => p.is_home)
  if (featured) posts = posts.filter((p) => p.is_featured)
  if (pinned) posts = posts.filter((p) => p.is_pinned)
  posts = posts.slice().sort(sort === 'order' ? byOrder : byDateDesc)
  return typeof limit === 'number' ? posts.slice(0, limit) : posts
}

export async function getPost(category, slug) {
  const posts = await allPosts()
  return posts.find((p) => p.category === category && p.slug === slug) || null
}

export async function getAllPostRefs() {
  const posts = await allPosts()
  return posts.map((p) => ({ category: p.category, slug: p.slug }))
}

export async function searchPosts(qStr) {
  const s = (qStr || '').trim().toLowerCase()
  if (!s) return []
  const posts = await allPosts()
  return posts
    .filter((p) =>
      [p.title, p.summary, p.content, (p.tags || []).join(' '), p.category]
        .join(' ').toLowerCase().includes(s)
    )
    .sort(byDateDesc)
}

export async function getAllTags() {
  const posts = await allPosts()
  const set = new Map()
  posts.forEach((p) => (p.tags || []).forEach((t) => set.set(t, (set.get(t) || 0) + 1)))
  return [...set.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}
