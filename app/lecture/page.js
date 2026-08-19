import Link from 'next/link'

export const metadata = { title: '강의 · 컨설팅', description: '인공지능·미래사회·4차산업혁명·블록체인·디지털전환·바이브코딩 등 맞춤형 강의와 컨설팅.' }
const AREAS = [
  { icon: '🧠', t: '인공지능 · AI', d: 'AI가 바꾸는 산업과 일. 경영진·실무자 눈높이 강의.' },
  { icon: '🌐', t: '미래사회 · 미래예측', d: '다가올 변화를 읽고 조직의 방향을 설계합니다.' },
  { icon: '🚀', t: '4차 산업혁명', d: '빅데이터·로보틱스·메타버스까지 큰 그림을 연결.' },
  { icon: '⛓️', t: '블록체인 · Web3', d: '블록체인·가상자산·탈중앙 경제의 본질과 기회.' },
  { icon: '🔄', t: '디지털 전환(DX)', d: '기업의 디지털 트랜스포메이션 전략과 실행.' },
  { icon: '💻', t: '바이브코딩', d: 'AI를 활용한 새로운 개발·기획 방식.' },
  { icon: '🌱', t: 'ESG · 미래산업', d: '지속가능성과 미래산업 트렌드.' },
  { icon: '🎓', t: '맞춤형 혁신 교육', d: '정부기관·대기업 대상 맞춤 설계 프로그램.' },
]
const CLIENTS = ['삼성전자', '현대자동차그룹', 'LG전자', '롯데그룹', '신한금융', '미래에셋', '한국전력', '행정안전부', '과학기술정보통신부', '경찰청', '고려대', '경희대']

export default function Lecture() {
  return (
    <>
      <section className="pagehero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#a9c2f5' }}>Lecture & Consulting</span>
          <h1>강의 · 컨설팅</h1>
          <p>미래기술과 사회변화를 주제로, 조직에 맞는 강의와 컨설팅을 제공합니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center" style={{ marginBottom: 34 }}>
            <span className="eyebrow">Areas</span><h2 className="section-title">주요 분야</h2>
          </div>
          <div className="grid grid--3">
            {AREAS.map((a) => (
              <div className="card" key={a.t}><div className="card__icon">{a.icon}</div><h3>{a.t}</h3><p>{a.d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container center">
          <span className="eyebrow">Clients</span>
          <h2 className="section-title" style={{ marginBottom: 24 }}>함께해 온 곳</h2>
          <div className="pills" style={{ justifyContent: 'center', maxWidth: 780, margin: '0 auto' }}>
            {CLIENTS.map((c) => <span className="pill" key={c}>{c}</span>)}<span className="pill">외 다수</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><div className="cta">
          <h2>강의를 요청하고 싶으신가요?</h2>
          <p>주제, 일정, 대상 인원을 알려주시면 맞춤 제안을 드립니다.</p>
          <div className="hero__actions"><Link href="/contact" className="btn btn--primary">강의 문의하기</Link></div>
        </div></div>
      </section>
    </>
  )
}
