import { SITE } from '@/lib/site'
import { getTravelPosts } from '@/lib/travel'
import TravelCard from '@/components/TravelCard'

export const revalidate = 60
export const metadata = {
  title: '양성길의 세계여행',
  description: '2004년부터 이어온 세계여행 기록. 양성길의 세계여행 네이버 블로그에서 엄선한 여행기를 모았습니다.',
}

export default async function Travel() {
  const posts = await getTravelPosts()
  return (
    <>
      <section className="pagehero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#a9c2f5' }}>Since 2004</span>
          <h1>양성길의 세계여행</h1>
          <p>2004년부터 꾸준히 기록해 온 세계여행 이야기. 누적 방문객 2,900만+ 블로그에서 엄선한 여행기를 모았습니다.</p>
          <div style={{ marginTop: 26 }}>
            <a href={SITE.blog} target="_blank" rel="noreferrer" className="btn btn--ghost">네이버 블로그 전체 보기 ↗</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length === 0 ? (
            <div className="notice">
              <span className="badge">준비 중</span>
              <h3>여행기를 하나씩 정리하고 있습니다</h3>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>네이버 블로그의 여행 글을 선별해 순차적으로 올릴 예정입니다.</p>
            </div>
          ) : (
            <div className="grid grid--3">
              {posts.map((p) => <TravelCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
