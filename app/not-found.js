import Link from 'next/link'
export default function NotFound() {
  return (
    <section className="section"><div className="container notice">
      <span className="badge">404</span>
      <h2 className="section-title">페이지를 찾을 수 없습니다</h2>
      <p style={{ color: 'var(--muted)', margin: '10px auto 22px', maxWidth: 480 }}>주소가 변경되었거나 존재하지 않는 페이지입니다.</p>
      <Link href="/" className="btn btn--primary">홈으로</Link>
    </div></section>
  )
}
