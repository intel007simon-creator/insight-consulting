import { SITE } from '@/lib/site'
import { ALL_CATEGORIES } from '@/lib/categories'
import { getAllPostRefs } from '@/lib/data'

// 빌드 시 한 번만 만들어지면 어드민에서 새로 올린 글이 빠지므로, 1시간마다 다시 생성합니다.
export const revalidate = 3600

export default async function sitemap() {
  const base = SITE.domain
  const staticPaths = ['', '/about', '/profile', '/futuresalon', '/travel', '/library', '/members', '/contact', '/search']
  const cats = ALL_CATEGORIES.map((c) => `/futuresalon/${c.slug}`)
  // 한글 슬러그는 퍼센트 인코딩해야 사이트맵 URL로 유효합니다.
  const posts = (await getAllPostRefs()).map((p) => `/futuresalon/${p.category}/${encodeURIComponent(p.slug)}`)
  const now = new Date()
  return [...staticPaths, ...cats, ...posts].map((path) => ({ url: `${base}${path}`, lastModified: now }))
}
