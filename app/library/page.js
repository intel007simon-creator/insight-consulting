import Link from 'next/link'
export const metadata = { title: '자료실', description: '강의자료·PDF 자료실 (준비 중).' }
export default function Library() {
  return (
    <section className="section"><div className="container notice">
      <span className="badge">준비 중 · Phase 2</span>
      <h2 className="section-title">자료실을 준비하고 있습니다</h2>
      <p style={{ color: 'var(--muted)', margin: '10px auto 22px', maxWidth: 520 }}>
        강의자료, PDF, 발표자료를 회원에게 제공하는 자료실을 준비 중입니다. 오픈 소식은 뉴스레터로 안내드립니다.
      </p>
      <Link href="/futuresalon" className="btn btn--outline">미래살롱 둘러보기</Link>
    </div></section>
  )
}
