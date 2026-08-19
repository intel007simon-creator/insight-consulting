import { searchPosts } from '@/lib/data'
import PostCard from '@/components/PostCard'
import SearchBox from '@/components/SearchBox'

export const metadata = { title: '검색', description: '미래살롱 전체 글 검색.' }

export default async function Search({ searchParams }) {
  const sp = await searchParams
  const q = (sp?.q || '').trim()
  const results = q ? await searchPosts(q) : []
  return (
    <>
      <section className="pagehero"><div className="container">
        <span className="eyebrow" style={{ color: '#a9c2f5' }}>Search</span>
        <h1>검색</h1><p>제목·본문·태그·카테고리에서 미래살롱의 글을 찾아보세요.</p>
      </div></section>
      <section className="section"><div className="container">
        <SearchBox initial={q} />
        {q && <p style={{ margin: '22px 0', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--ink)' }}>“{q}”</strong> 검색 결과 {results.length}개
        </p>}
        {q && results.length === 0 && (
          <div className="notice"><span className="badge">결과 없음</span>
            <h3>검색 결과가 없습니다</h3>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>다른 키워드로 다시 검색해 보세요.</p>
          </div>
        )}
        {results.length > 0 && <div className="grid grid--3">{results.map((p) => <PostCard key={p.id} post={p} />)}</div>}
      </div></section>
    </>
  )
}
