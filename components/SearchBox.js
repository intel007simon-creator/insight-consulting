'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBox({ initial = '' }) {
  const [q, setQ] = useState(initial)
  const router = useRouter()
  const submit = (e) => { e.preventDefault(); const s = q.trim(); if (s) router.push(`/search?q=${encodeURIComponent(s)}`) }
  return (
    <form className="searchbar" onSubmit={submit}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="제목, 본문, 태그로 검색하세요" aria-label="검색어" />
      <button type="submit" className="btn btn--primary">검색</button>
    </form>
  )
}
