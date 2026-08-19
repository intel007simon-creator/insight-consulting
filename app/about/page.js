import Link from 'next/link'
import { CATEGORY_GROUPS } from '@/lib/categories'

export const metadata = { title: '회사소개', description: '인싸이트컨설팅은 미래기술과 사회변화를 연구하고 기업·기관에 강의와 컨설팅을 제공하는 회사입니다.' }
const FIELDS = ['인공지능', '4차산업혁명', '블록체인', 'Web3', '빅데이터', '로보틱스', '메타버스', '디지털전환', '미래사회', '신기술 전략']

export default function About() {
  return (
    <>
      <section className="pagehero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#a9c2f5' }}>About</span>
          <h1>회사소개</h1>
          <p>미래기술과 사회변화를 연구하고, 기업과 기관의 미래 전략을 함께 설계합니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">Insight Consulting</span>
          <h2 className="section-title">변화를 먼저 읽는 미래기술 파트너</h2>
          <p className="section-lead" style={{ maxWidth: 'none' }}>
            인싸이트컨설팅은 미래기술과 사회변화를 연구하고, 기업과 기관을 대상으로 강의와 컨설팅을 제공하는 회사입니다.
            2005년 설립 이후 20년 넘게 기술의 흐름을 관찰하고 해석하며, 조직이 다가올 변화에 대비할 수 있도록 돕고 있습니다.
          </p>
          <h3 style={{ margin: '30px 0 14px' }}>핵심 분야</h3>
          <div className="pills">{FIELDS.map((f) => <span className="pill" key={f}>{f}</span>)}</div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="center" style={{ marginBottom: 30 }}>
            <span className="eyebrow">Future Salon</span>
            <h2 className="section-title">미래살롱에서 다루는 주제</h2>
          </div>
          <div className="grid grid--3">
            {CATEGORY_GROUPS.map((g) => (
              <div className="card" key={g.group}>
                <h3>{g.groupKo}</h3>
                <p>{g.items.map((i) => i.ko).join(' · ')}</p>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop: 26 }}>
            <Link href="/futuresalon" className="btn btn--outline">미래살롱 둘러보기</Link>
          </div>
        </div>
      </section>
    </>
  )
}
