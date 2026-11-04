import './globals.css'
import { SITE } from '@/lib/site'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const SITE_TITLE = `${SITE.ceo} | ${SITE.company} 대표 · AI 미래기술 강의 · 양성길의 세계여행`
const SITE_DESC = `${SITE.company}(인사이트컨설팅·Insight Consulting) 대표 ${SITE.ceo}(Simon Yang). 2005년부터 인공지능·블록체인·4차산업혁명·디지털전환·바이브코딩 강의와 컨설팅, 2004년부터 누적 3천만 방문 블로그 '양성길의 세계여행', 미래기술 아카이브 '${SITE.brand}'.`

export const metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: SITE_TITLE, template: `%s | ${SITE.company} ${SITE.ceo}` },
  description: SITE_DESC,
  keywords: ['양성길', '양성길의 세계여행', '양성길의세계여행', '인싸이트컨설팅', '인사이트컨설팅', '인싸이트 컨설팅', '양성길 대표', '양성길 강사', 'Simon Yang', 'Insight Consulting', '미래살롱', 'AI 강의', '인공지능 강사', '블록체인 강의', '4차산업혁명 강사', '바이브코딩 강의', '미래예측', '기업 특강'],
  authors: [{ name: SITE.ceo, url: `${SITE.domain}/profile` }],
  openGraph: {
    type: 'website', locale: 'ko_KR', siteName: `${SITE.company} ${SITE.ceo}`,
    title: SITE_TITLE, description: SITE_DESC, url: SITE.domain,
    images: [{ url: '/profile-round.png', alt: `${SITE.company} 대표 ${SITE.ceo}` }],
  },
  twitter: { card: 'summary', title: SITE_TITLE, description: SITE_DESC, images: ['/profile-round.png'] },
  robots: { index: true, follow: true },
  // 네이버 서치어드바이저·구글 서치콘솔 소유확인 코드는 Vercel 환경변수로 넣습니다.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: { 'naver-site-verification': process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || 'f2dcfc79dbe6035b98ebe9595ad2fa9a46b18581' },
  },
}

const SAME_AS = [SITE.blog, SITE.youtube, SITE.instagram, SITE.facebook, SITE.linkedin]
const jsonLd = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${SITE.domain}/#website`, url: SITE.domain, name: `${SITE.company} ${SITE.ceo}`,
      alternateName: ['양성길', '인사이트컨설팅', 'Insight Consulting', '양성길의 세계여행', SITE.brand], inLanguage: 'ko-KR',
      publisher: { '@id': `${SITE.domain}/#org` },
      potentialAction: { '@type': 'SearchAction', target: `${SITE.domain}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
    { '@type': 'Organization', '@id': `${SITE.domain}/#org`, name: SITE.company,
      alternateName: ['인사이트컨설팅', '인싸이트 컨설팅', SITE.companyEn], url: SITE.domain, email: SITE.email,
      telephone: SITE.phoneTel, logo: `${SITE.domain}/profile-round.png`, foundingDate: '2005',
      description: SITE_DESC, founder: { '@id': `${SITE.domain}/#ceo` }, sameAs: SAME_AS },
    { '@type': 'Person', '@id': `${SITE.domain}/#ceo`, name: SITE.ceo, alternateName: [SITE.ceoEn, '양성길 대표', '양성길의 세계여행'],
      jobTitle: '인싸이트컨설팅 대표', worksFor: { '@id': `${SITE.domain}/#org` },
      image: `${SITE.domain}/profile-round.png`, url: `${SITE.domain}/profile`,
      alumniOf: '명지대학교 전자공학과',
      knowsAbout: ['인공지능', '블록체인', '4차 산업혁명', '디지털 전환', '바이브 코딩', '미래예측', 'SNS 마케팅', '세계여행'],
      sameAs: SAME_AS },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
