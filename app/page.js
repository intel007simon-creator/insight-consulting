export const revalidate = 60
import Link from 'next/link'
import { SITE } from '@/lib/site'
import { CATEGORY_GROUPS } from '@/lib/categories'
import { getPosts } from '@/lib/data'
import PostCard from '@/components/PostCard'

const FIELDS = ['인공지능', '4차산업혁명', '블록체인', 'Web3', '빅데이터', '로보틱스', '메타버스', '디지털전환', '미래사회', '신기술 전략']
const techGroup = CATEGORY_GROUPS[0] // Future Technology

export default async function Home() {
  const [pinned, latest, forecast, archive] = await Promise.all([
    getPosts({ featured: true, sort: 'order', limit: 3 }),
    getPosts({ home: true, limit: 6 }),
    getPosts({ corner: 'forecast', limit: 3 }),
    getPosts({ corner: 'archive', limit: 3 }),
  ])

  return (
    <>
      {/* 1. Hero */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__brand">Insight Consulting</div>
          <h1>인싸이트컨설팅<small>미래기술 강의 · 컨설팅</small></h1>
          <div className="hero__salon">{SITE.brandEn}</div>
          <p className="hero__slogan">{SITE.slogan}</p>
          <div className="hero__actions">
            <Link href="/futuresalon" className="btn btn--primary">미래살롱 보기</Link>
            <Link href="/contact" className="btn btn--ghost">강의 문의</Link>
            <Link href="/profile" className="btn btn--ghost">양성길 대표 소개</Link>
          </div>
        </div>
      </section>

      {/* 2. 회사소개 */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 36 }}>
            <span className="eyebrow">About</span>
            <h2 className="section-title">미래기술과 사회변화를 연구합니다</h2>
            <p className="section-lead">
              인싸이트컨설팅은 미래기술과 사회변화를 연구하고, 기업과 기관을 대상으로 강의와 컨설팅을 제공합니다.
              변화를 먼저 읽고, 조직이 나아갈 방향을 함께 설계합니다.
            </p>
          </div>
          <div className="pills" style={{ justifyContent: 'center', maxWidth: 760, margin: '0 auto' }}>
            {FIELDS.map((f) => <span className="pill" key={f}>{f}</span>)}
          </div>
        </div>
      </section>

      {/* 3. 양성길 대표 */}
      <section className="section section--soft">
        <div className="container grid grid--2" style={{ alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Profile</span>
            <h2 className="section-title">양성길 <span style={{ color: 'var(--blue-600)' }}>Simon Yang</span></h2>
            <p className="section-lead">
              前 Intel Korea(10년)·LG전자 연구소(5년) 엔지니어 출신의 미래기술 전문가.
              정보통신산업진흥원 블록체인 평가위원, 한국AI교육협회 수석부회장으로 활동하며
              20년 넘게 기술과 미래를 연구·강의해 왔습니다.
            </p>
            <div style={{ marginTop: 22 }}>
              <Link href="/profile" className="btn btn--outline">대표 프로필 보기</Link>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 14 }}>주요 활동</h3>
            <ul className="checklist">
              <li>인싸이트컨설팅 대표</li>
              <li>블록체인 평가위원 (정보통신산업진흥원 / 과기정통부)</li>
              <li>한국AI교육협회 수석부회장</li>
              <li>블록체인투데이 전문위원</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Future Salon 소개 */}
      <section className="section">
        <div className="container center">
          <span className="eyebrow">Future Salon by Simon Yang</span>
          <h2 className="section-title">양성길의 미래살롱</h2>
          <p className="section-lead">
            AI, 블록체인, 양자컴퓨팅, 로봇, 바이오, 우주산업 등 미래를 바꿀 기술과 사회 변화를
            기록하고 분석하는 지식 아카이브입니다.
          </p>
        </div>
      </section>

      {/* 5. 대표글 */}
      {pinned.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="sechead">
              <div><span className="eyebrow">Featured</span><h2 className="section-title">대표글</h2></div>
              <Link href="/futuresalon" className="more">전체 보기 →</Link>
            </div>
            <div className="grid grid--3">
              {pinned.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* 7. 최신글 */}
      <section className="section section--soft">
        <div className="container">
          <div className="sechead">
            <div><span className="eyebrow">Latest</span><h2 className="section-title">최신글</h2></div>
            <Link href="/futuresalon" className="more">더 보기 →</Link>
          </div>
          <div className="grid grid--3">
            {latest.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </section>

      {/* 8. Future Technology 카테고리 */}
      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 30 }}>
            <span className="eyebrow">Categories</span>
            <h2 className="section-title">{techGroup.groupKo} · Future Technology</h2>
          </div>
          <div className="cats" style={{ justifyContent: 'center', maxWidth: 820, margin: '0 auto' }}>
            {techGroup.items.map((c) => (
              <Link key={c.slug} href={`/futuresalon/${c.slug}`}>{c.ko}</Link>
            ))}
          </div>
          <div className="center" style={{ marginTop: 22 }}>
            <Link href="/futuresalon" className="more">전체 카테고리 보기 →</Link>
          </div>
        </div>
      </section>

      {/* 9 & 10. Forecast / Archive */}
      <section className="section section--soft">
        <div className="container grid grid--2">
          <div>
            <span className="eyebrow">Future Forecast</span>
            <h2 className="section-title" style={{ marginBottom: 18 }}>미래 전망</h2>
            <div className="record">
              {forecast.map((p) => (
                <Link key={p.id} href={`/futuresalon/${p.category}/${p.slug}`} className="record__item">
                  <div className="record__badge">{p.forecastYear || '전망'}</div>
                  <div className="record__body"><strong>{p.title}</strong><p>{p.summary}</p></div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow">Future Archive</span>
            <h2 className="section-title" style={{ marginBottom: 18 }}>미래 아카이브</h2>
            <div className="record">
              {archive.map((p) => (
                <Link key={p.id} href={`/futuresalon/${p.category}/${p.slug}`} className="record__item">
                  <div className="record__badge">{p.archiveVerdict || '재평가'}</div>
                  <div className="record__body"><strong>{p.title}</strong><p>작성 {p.published_at}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. 강의 & 컨설팅 + 12. 회원 + 13. 블로그 */}
      <section className="section">
        <div className="container">
          <div className="cta">
            <h2>강의 · 컨설팅을 찾고 계신가요?</h2>
            <p>인공지능, 미래사회, 4차산업혁명, 블록체인, 디지털전환, 바이브코딩까지 — 맞춤형으로 함께합니다.</p>
            <div className="hero__actions">
              <Link href="/lecture" className="btn btn--primary">강의·컨설팅 안내</Link>
              <Link href="/contact" className="btn btn--ghost">문의하기</Link>
              <a href={SITE.blog} target="_blank" rel="noreferrer" className="btn btn--ghost">네이버 블로그 ↗</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
