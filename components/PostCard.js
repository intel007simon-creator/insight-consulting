import Link from 'next/link'
import { getCategory } from '@/lib/categories'
import { proxiedImageUrl } from '@/lib/imageProxy'

// 세계여행 카드(TravelCard)와 같은 형태: 상단에 대표 이미지 1장, 아래에 글 정보.
// 네이버 원문 URL이 있으면 클릭 시 네이버 블로그를 새 창으로 열고, 없으면 사이트 내부 상세 페이지로 이동합니다.
export default function PostCard({ post }) {
  const cat = getCategory(post.category)
  const body = (
    <>
      <div className="travelcard__thumb">
        {post.thumbnail
          ? <img src={proxiedImageUrl(post.thumbnail)} alt={post.title} loading="lazy" />
          : <div className="travelcard__thumb--placeholder">{cat ? cat.ko : '양성길의 미래살롱'}</div>}
      </div>
      <div className="travelcard__body">
        <div className="postcard__meta">
          {post.is_pinned && <span className="chip chip--pin">추천</span>}
          {cat && <span className="chip">{cat.ko}</span>}
          <span>{post.published_at}</span>
        </div>
        <h3>{post.title}</h3>
        {post.summary && <p>{post.summary}</p>}
        {(post.tags || []).length > 0 && (
          <div className="postcard__tags">
            {post.tags.slice(0, 3).map((t) => <span key={t} className="tag">#{t}</span>)}
          </div>
        )}
        {post.naver_url && <span className="travelcard__link">네이버 블로그에서 보기 ↗</span>}
      </div>
    </>
  )

  if (post.naver_url) {
    return <a href={post.naver_url} target="_blank" rel="noreferrer" className="postcard travelcard">{body}</a>
  }
  return <Link href={`/futuresalon/${post.category}/${post.slug}`} className="postcard travelcard">{body}</Link>
}
