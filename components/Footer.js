import Link from 'next/link'
import { SITE } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <div className="brand">
              <span className="brand__mark">IC</span>
              <span className="brand__text">
                <span className="brand__ko">{SITE.company}</span>
                <span className="brand__en">Insight Consulting</span>
              </span>
            </div>
            <p className="footer__desc">{SITE.brandEn}<br />{SITE.slogan}</p>
          </div>
          <div>
            <h4>회사</h4>
            <ul>
              <li><Link href="/about">회사소개</Link></li>
              <li><Link href="/profile">양성길 대표</Link></li>
              <li><Link href="/lecture">강의·컨설팅</Link></li>
              <li><Link href="/media">저서·미디어</Link></li>
            </ul>
          </div>
          <div>
            <h4>미래살롱</h4>
            <ul>
              <li><Link href="/futuresalon">Future Salon</Link></li>
              <li><Link href="/search">검색</Link></li>
              <li><Link href="/library">자료실</Link></li>
              <li><Link href="/members">회원</Link></li>
            </ul>
          </div>
          <div>
            <h4>연결</h4>
            <ul>
              <li><a href={SITE.blog} target="_blank" rel="noreferrer">네이버 블로그</a></li>
              <li><a href={SITE.youtube} target="_blank" rel="noreferrer">양성길TV</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><Link href="/contact">문의하기</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {SITE.company} (Insight Consulting). All Rights Reserved.</span>
          <span>대표 {SITE.ceo} / Simon Yang · {SITE.phone}</span>
        </div>
      </div>
    </footer>
  )
}
