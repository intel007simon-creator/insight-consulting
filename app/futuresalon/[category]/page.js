import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategory, ALL_CATEGORIES } from '@/lib/categories'
import { getPosts } from '@/lib/data'
import PostCard from '@/components/PostCard'

export async function generateMetadata({ params }) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return { title: '카테고리' }
  return { title: `${cat.ko} (${cat.name}) · 미래살롱`, description: `${cat.ko} 관련 미래기술 인사이트 모음 — 양성길의 미래살롱.` }
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()
  const posts = await getPosts({ category })

  return (
    <>
      <section className="pagehero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#a9c2f5' }}>{cat.groupKo} · {cat.name}</span>
          <h1>{cat.ko}</h1>
          <p>{cat.ko}({cat.name}) 관련 미래기술과 변화를 분석한 글 모음입니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p style={{ color: 'var(--muted)', marginBottom: 22 }}>
            <Link href="/futuresalon" style={{ color: 'var(--blue-700)', fontWeight: 600 }}>← 미래살롱</Link>
            <span style={{ margin: '0 8px' }}>·</span>{posts.length}개의 글
          </p>
          {posts.length === 0 ? (
            <div className="notice"><span className="badge">준비 중</span>
              <h3>이 카테고리의 글을 준비하고 있습니다</h3>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>네이버 블로그의 관련 글을 선별해 순차적으로 정리할 예정입니다.</p>
            </div>
          ) : (
            <div className="grid grid--3">{posts.map((p) => <PostCard key={p.id} post={p} />)}</div>
          )}
        </div>
      </section>
    </>
  )
}
