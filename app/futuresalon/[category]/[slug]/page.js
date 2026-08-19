import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SITE } from '@/lib/site'
import { getCategory } from '@/lib/categories'
import { getPost } from '@/lib/data'

export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const post = await getPost(category, slug)
  if (!post) return { title: '글을 찾을 수 없습니다' }
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: 'article', title: post.title, description: post.summary, publishedTime: post.published_at },
  }
}

export default async function PostPage({ params }) {
  const { category, slug } = await params
  const post = await getPost(category, slug)
  if (!post) notFound()
  const cat = getCategory(category)

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.summary,
    datePublished: post.published_at, dateModified: post.updated_at || post.published_at,
    author: { '@type': 'Person', name: post.author || SITE.ceo },
    publisher: { '@type': 'Organization', name: SITE.company },
  }

  return (
    <article className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container prose">
        <div style={{ marginBottom: 18 }}>
          <Link href={`/futuresalon/${category}`} style={{ color: 'var(--blue-700)', fontWeight: 600 }}>
            ← {cat ? cat.ko : '미래살롱'}
          </Link>
        </div>
        <div className="postcard__meta" style={{ marginBottom: 14 }}>
          {post.is_pinned && <span className="chip chip--pin">추천</span>}
          {cat && <span className="chip">{cat.ko}</span>}
          <span>작성 {post.published_at}</span>
          {post.updated_at && post.updated_at !== post.published_at && <span>· 수정 {post.updated_at}</span>}
        </div>
        <h1 style={{ fontSize: 'clamp(1.7rem,4vw,2.5rem)', lineHeight: 1.25 }}>{post.title}</h1>
        <p style={{ marginTop: 16, fontSize: '1.15rem', color: 'var(--muted)' }}>{post.summary}</p>

        <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '28px 0' }} />

        <div>
          {String(post.content || '').split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className="postcard__tags" style={{ marginTop: 28 }}>
          {(post.tags || []).map((t) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="tag">#{t}</Link>
          ))}
        </div>

        {post.naver_url && (
          <div style={{ marginTop: 34, padding: '22px 24px', background: 'var(--soft)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
            <strong style={{ color: 'var(--ink)' }}>네이버 블로그 원문 보기</strong>
            <p style={{ color: 'var(--muted)', margin: '6px 0 14px', fontSize: '.94rem' }}>
              이 글의 원문은 ‘양성길의 세계여행’ 블로그에서도 볼 수 있습니다.
            </p>
            <a href={post.naver_url} target="_blank" rel="noreferrer" className="btn btn--outline">원문 열기 ↗</a>
          </div>
        )}
      </div>
    </article>
  )
}
