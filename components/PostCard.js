import Link from 'next/link'
import { getCategory } from '@/lib/categories'

export default function PostCard({ post }) {
  const cat = getCategory(post.category)
  return (
    <Link href={`/futuresalon/${post.category}/${post.slug}`} className="postcard">
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
    </Link>
  )
}
