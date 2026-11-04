import Link from 'next/link'
import { SITE } from '@/lib/site'

export const metadata = {
  title: '양성길대표 (Simon Yang) · 프로필 · 강의 · 컨설팅 · 저서 · 미디어',
  description: '前 Intel·LG 엔지니어 출신 미래기술 전문가, 인싸이트컨설팅 대표 양성길(Simon Yang)의 프로필과 인공지능·블록체인·4차산업혁명·디지털전환·바이브코딩 강의·컨설팅, 저서와 방송·언론 활동.',
}

const POSITIONS = ['인싸이트컨설팅 대표', '블록체인 평가위원 (정보통신산업진흥원 / 과기정통부)', '블록체인투데이 전문위원', '한국AI교육협회 수석부회장', '아시아로 자문교수', '세계전뇌학습아카데미 전문위원', '힐링투어클럽 회장']
const CAREER = [
  ['10년', 'Intel Korea 엔지니어 (FAE)'],
  ['5년', 'LG전자 PC 연구소 엔지니어'],
  ['역임', 'Tomtech 부사장 · Mobilro/Jointec 대표이사'],
  ['위촉', '수출전문가(중소기업청) · 다문화TV 자문위원'],
]
// 강의·컨설팅 분야 (기존 /lecture 페이지 내용 통합)
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
const BROADCAST = [
  ['YTN', '사이언스스페셜 「4차 산업혁명과 직업탐방」, 「성공팁! 과학톡」'],
  ['한국경제TV', '가상자산 투자법'],
  ['MBC', '시사토론 「가짜뉴스, 그것이 알고 싶다」, 생방송 오늘'],
  ['EBS', '시 콘서트 「시를 사랑하는 그를 만나다」'],
  ['KBS · 이데일리TV · 다문화TV', '다수 출연 및 콘텐츠 개발'],
]
const BOOKS = ['패시브 인컴', '4차 산업혁명 Why?', '이것이 4차 산업혁명이다', 'SNS홍보마케팅의 신', '따라하면 매출이 따라오는 인스타그램 마케팅']

export default function Profile() {
  return (
    <>
      <section className="pagehero">
        <div className="container">
          <span className="eyebrow" style={{ color: '#a9c2f5' }}>Profile</span>
          <h1>양성길 <span style={{ color: '#a9c2f5' }}>Simon Yang</span></h1>
          <p>前 Intel·LG 엔지니어 출신의 미래기술 전문가. 인싸이트컨설팅 대표.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <p className="section-lead" style={{ maxWidth: 'none', marginTop: 0 }}>
            4차 산업혁명, 디지털 전환, 미래사회를 연구하고 강의해 온 콘텐츠 크리에이터입니다.
            미래기술과 사회변화를 주제로 정부기관·대기업에 맞춤형 강의와 컨설팅을 제공합니다.
            2004년부터 운영해 온 ‘양성길의세계여행’ 블로그는 누적 방문객 2,900만+를 기록하고 있습니다.
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <span className="eyebrow">Positions</span>
          <h2 className="section-title" style={{ marginBottom: 24 }}>주요 활동</h2>
          <div className="grid grid--2">
            {POSITIONS.map((p) => (
              <div className="card" key={p} style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', gap: 10 }}><span style={{ color: 'var(--blue-600)', fontWeight: 800 }}>✓</span><span>{p}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Career</span>
          <h2 className="section-title" style={{ marginBottom: 24 }}>경력</h2>
          <div className="record">
            {CAREER.map(([p, r]) => (
              <div className="record__item" key={r}><div className="record__badge">{p}</div><div className="record__body"><strong>{r}</strong></div></div>
            ))}
          </div>
          <p style={{ marginTop: 16, color: 'var(--muted)' }}>학력 · 명지대학교 공과대학 전자공학과 졸업</p>
        </div>
      </section>

      <section className="section section--soft" id="lecture">
        <div className="container">
          <span className="eyebrow">Lecture &amp; Consulting</span>
          <h2 className="section-title" style={{ marginBottom: 8 }}>강의 · 컨설팅 분야</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>조직의 목적과 대상에 맞춰 주제와 깊이를 설계합니다.</p>
          <div className="grid grid--3">
            {AREAS.map((a) => (
              <div className="card" key={a.t}><div className="card__icon">{a.icon}</div><h3>{a.t}</h3><p>{a.d}</p></div>
            ))}
          </div>
          <h3 style={{ margin: '36px 0 14px' }}>함께해 온 곳</h3>
          <div className="pills">
            {CLIENTS.map((c) => <span className="pill" key={c}>{c}</span>)}<span className="pill">외 다수</span>
          </div>
        </div>
      </section>

      <section className="section" id="media">
        <div className="container">
          <span className="eyebrow">Books &amp; Media</span>
          <h2 className="section-title" style={{ marginBottom: 8 }}>저서 · 미디어</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>책과 방송으로 미래기술을 쉽고 깊이 있게 전해 왔습니다.</p>
        </div>
        <div className="container grid grid--2" style={{ alignItems: 'start' }}>
          <div>
            <h3 style={{ marginBottom: 14 }}>저서</h3>
            <ul className="checklist">{BOOKS.map((b) => <li key={b}>『{b}』</li>)}<li>외 다수</li></ul>
          </div>
          <div>
            <h3 style={{ marginBottom: 14 }}>방송 및 언론</h3>
            <div className="record">
              {BROADCAST.map(([c, d]) => (
                <div className="record__item" key={c}><div className="record__badge" style={{ minWidth: 140 }}>{c}</div><div className="record__body"><strong>{d}</strong></div></div>
              ))}
            </div>
            <p style={{ marginTop: 18, color: 'var(--muted)' }}>유튜브 <a href={SITE.youtube} target="_blank" rel="noreferrer" style={{ color: 'var(--blue-700)', fontWeight: 600 }}>양성길TV</a>에서도 다양한 영상을 만나보실 수 있습니다.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container"><div className="cta">
          <h2>강의 · 컨설팅 문의</h2>
          <p>주제, 일정, 대상 인원을 알려주시면 맞춤 제안을 드립니다. 정부기관·대기업 맞춤형 교육부터 미래 전략 컨설팅까지 함께합니다.</p>
          <div className="hero__actions"><Link href="/contact" className="btn btn--primary">강의 문의하기</Link>
          <a href={SITE.blog} target="_blank" rel="noreferrer" className="btn btn--ghost">네이버 블로그 ↗</a></div>
        </div></div>
      </section>
    </>
  )
}
