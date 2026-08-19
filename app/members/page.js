import Link from 'next/link'
export const metadata = { title: '회원', description: '회원가입 및 뉴스레터 (준비 중).' }
export default function Members() {
  return (
    <section className="section"><div className="container notice">
      <span className="badge">준비 중 · Phase 2</span>
      <h2 className="section-title">회원 기능을 준비하고 있습니다</h2>
      <p style={{ color: 'var(--muted)', margin: '10px auto 22px', maxWidth: 520 }}>
        관심 분야 설정, 즐겨찾기, 뉴스레터, 회원 전용 자료 등을 제공하는 회원 시스템을 준비 중입니다.
      </p>
      <Link href="/contact" className="btn btn--outline">문의하기</Link>
    </div></section>
  )
}
