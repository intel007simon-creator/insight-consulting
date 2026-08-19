import './globals.css'
import { SITE } from '@/lib/site'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  metadataBase: new URL(SITE.domain),
  title: { default: `${SITE.company} · ${SITE.brand}`, template: `%s · ${SITE.company}` },
  description: `${SITE.company}(Insight Consulting) — ${SITE.slogan} 인공지능·블록체인·미래사회를 연구하는 미래기술 강의·컨설팅.`,
  keywords: ['인싸이트컨설팅', '양성길', 'Simon Yang', '미래살롱', '인공지능', '블록체인', '4차산업혁명', '미래예측', '강의', '컨설팅'],
  authors: [{ name: SITE.ceo }],
  openGraph: {
    type: 'website', locale: 'ko_KR', siteName: SITE.company,
    title: `${SITE.company} · ${SITE.brand}`, description: SITE.slogan, url: SITE.domain,
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', name: SITE.company, alternateName: SITE.companyEn, url: SITE.domain, email: SITE.email,
      founder: { '@type': 'Person', name: SITE.ceo }, sameAs: [SITE.blog, SITE.youtube, SITE.instagram] },
    { '@type': 'Person', name: SITE.ceo, alternateName: SITE.ceoEn, jobTitle: 'Insight Consulting CEO',
      url: `${SITE.domain}/profile`, sameAs: [SITE.blog, SITE.youtube, SITE.instagram] },
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
