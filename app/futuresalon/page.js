export const revalidate = 60
import Link from 'next/link'
import { SITE } from '@/lib/site'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { getPosts } from '@/lib/data'
import PostCard from '@/components/PostCard'

export const metadata = {
  title: '양성길의 미래살롱 (Future Salon)',
  description: 'AI·블록체인·양자컴퓨팅·로봇·바이오·우주산업 등 미래를 바꿀 기술과 사회 변화를 기록하고 분석하는 지식 아카이브.',
}

export default async function FutureSalon() {
  const latest = await getPosts({ limit: 6 })
  return (
    <>
      <section className="pagehero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#a9c2f5' }}>Future Salon by Simon Yang</span>
          <h1>양성길의 미래살롱</h1>
          <p>{SITE.slogan} — 미래를 바꿀 기술과 사회 변화를 기록하고 분석하는 지식 아카이브입니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sechead">
            <div><span className="eyebrow">Latest</span><h2 className="section-title">최신글</h2></div>
            <Link href="/search" className="more">검색 →</Link>
          </div>
          <div className="grid grid--3">
            {latest.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Categories</span>
            <h2 className="section-title">카테고리</h2>
          </div>
          <div className="catgrid">
            {CATEGORY_GROUPS.map((g) => (
              <div className="catgroup" key={g.group}>
                <h4>{g.groupKo} · {g.group}</h4>
                <div className="cats">
                  {g.items.map((c) => (
                    <Link key={c.slug} href={`/futuresalon/${c.slug}`}>{c.ko}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--3">
          <div className="card"><div className="card__icon">📰</div><h3>Future Insight</h3><p>최근 기술과 뉴스를 짧게 분석하는 칼럼. 무슨 일이 일어났고, 왜 중요하며, 무엇이 바뀌는가.</p></div>
          <div className="card"><div className="card__icon">🔭</div><h3>Future Forecast</h3><p>2030 · 2040 · 2050 — 시간축으로 미래를 전망합니다.</p></div>
          <div className="card"><div className="card__icon">🗂️</div><h3>Future Archive</h3><p>과거에 쓴 미래예측을 다시 보고, 적중 여부를 평가합니다.</p></div>
        </div>
      </section>
    </>
  )
}
