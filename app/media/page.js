import { SITE } from '@/lib/site'
export const metadata = { title: '저서 · 미디어', description: '양성길 대표의 저서와 방송·언론 활동.' }
const BOOKS = ['패시브 인컴', '4차 산업혁명 Why?', '이것이 4차 산업혁명이다', 'SNS홍보마케팅의 신', '따라하면 매출이 따라오는 인스타그램 마케팅']
const BROADCAST = [
  ['YTN', '사이언스스페셜 「4차 산업혁명과 직업탐방」, 「성공팁! 과학톡」'],
  ['한국경제TV', '가상자산 투자법'],
  ['MBC', '시사토론 「가짜뉴스, 그것이 알고 싶다」, 생방송 오늘'],
  ['EBS', '시 콘서트 「시를 사랑하는 그를 만나다」'],
  ['KBS · 이데일리TV · 다문화TV', '다수 출연 및 콘텐츠 개발'],
]
export default function Media() {
  return (
    <>
      <section className="pagehero"><div className="container">
        <span className="eyebrow" style={{ color: '#a9c2f5' }}>Books & Media</span>
        <h1>저서 · 미디어</h1><p>책과 방송으로 미래기술을 쉽고 깊이 있게 전해 왔습니다.</p>
      </div></section>
      <section className="section"><div className="container">
        <span className="eyebrow">Publications</span><h2 className="section-title" style={{ marginBottom: 22 }}>저서</h2>
        <div className="grid grid--3">{BOOKS.map((b) => <div className="card" key={b}><div className="card__icon">📘</div><h3 style={{ fontSize: '1.05rem' }}>{b}</h3></div>)}</div>
      </div></section>
      <section className="section section--soft"><div className="container">
        <span className="eyebrow">Broadcast</span><h2 className="section-title" style={{ marginBottom: 22 }}>방송 출연</h2>
        <div className="record">{BROADCAST.map(([c, d]) => <div className="record__item" key={c}><div className="record__badge" style={{ minWidth: 150 }}>{c}</div><div className="record__body"><strong>{d}</strong></div></div>)}</div>
        <p style={{ marginTop: 20, color: 'var(--muted)' }}>유튜브 <a href={SITE.youtube} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-700)', fontWeight: 600 }}>양성길TV</a> 에서도 다양한 영상을 만나보실 수 있습니다.</p>
      </div></section>
    </>
  )
}
