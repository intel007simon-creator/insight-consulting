import Link from 'next/link'
import { getCategory } from '@/lib/categories'

// 세계여행 카드(TravelCard)와 동일하게, 네이버 원문 URL이 있으면 클릭 시 네이버 블로그를 새 창으로 엽니다.
// 원문 URL이 없는 글만 사이트 내부 상세 페이지로 이동합니다.
export default function PostCard({ post }) {
  const cat = getCategory(post.category)
  const body = (
    <>
      <div className="postcard__meta">
        {post.is_pinned && <span className="chip chip--pin">추천</span>}
        {cat && <span className="chip">{cat.ko}</span>}
        <span>{post.published_at}</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div className="postcard__tags">
        {(post.tags || []).slice(0, 3).map((t) => <span key={t} className="tag">#{t}</span>)}
      </div>
      {post.naver_url && <span className="travelcard__link">네이버 블로그에서 보기 ↗</span>}
    </>
  )

  if (post.naver_url) {
    return (
      <a href={post.naver_url} target="_blank" rel="noreferrer" className="postcard">{body}</a>
    )
  }
  return (
    <Link href={`/futuresalon/${post.category}/${post.slug}`} className="postcard">{body}</Link>
  )
}
