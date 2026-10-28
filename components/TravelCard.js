import { proxiedImageUrl } from '@/lib/imageProxy'

export default function TravelCard({ post }) {
  return (
    <a href={post.naver_url} target="_blank" rel="noreferrer" className="postcard travelcard">
      <div className="travelcard__thumb">
        {post.thumbnail
          ? <img src={proxiedImageUrl(post.thumbnail)} alt={post.title} loading="lazy" />
          : <div className="travelcard__thumb--placeholder">양성길의 세계여행</div>}
      </div>
      <div className="travelcard__body">
        {post.is_featured && <span className="chip chip--pin" style={{ marginBottom: 8 }}>대표 여행기</span>}
        <h3>{post.title}</h3>
        {post.summary && <p>{post.summary}</p>}
        <span className="travelcard__link">네이버 블로그에서 보기 ↗</span>
      </div>
    </a>
  )
}
