'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDb, getAuthClient } from '@/lib/firebase'
import { ALL_CATEGORIES } from '@/lib/categories'

const EMPTY = {
  title: '', slug: '', category: 'ai', subcategory: '', summary: '', content: '',
  tags: '', naver_url: '', corner: '', forecastYear: '', archiveVerdict: '',
  published_at: '', display_order: 100, is_home: true, is_featured: false, is_pinned: false, status: 'published',
}

function slugify(s) {
  return (s || '').toString().trim().toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
}
function todayStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export default function Admin() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const auth = getAuthClient()
    if (!auth) { setReady(true); return }
    let unsub
    ;(async () => {
      const { onAuthStateChanged } = await import('firebase/auth')
      unsub = onAuthStateChanged(auth, (u) => { setUser(u); setReady(true); if (u) loadPosts() })
    })()
    return () => unsub && unsub()
  }, [])

  async function loadPosts() {
    try {
      const db = getDb()
      const { collection, getDocs } = await import('firebase/firestore')
      const snap = await getDocs(collection(db, 'posts'))
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      rows.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
      setPosts(rows)
    } catch (e) { setMsg('목록 로드 오류: ' + e.message) }
  }

  async function login(e) {
    e.preventDefault(); setErr('')
    try {
      const auth = getAuthClient()
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      await signInWithEmailAndPassword(auth, email, pw)
    } catch (e) { setErr('로그인 실패: ' + (e.code || e.message)) }
  }
  async function logout() {
    const auth = getAuthClient()
    const { signOut } = await import('firebase/auth')
    await signOut(auth); setUser(null); setPosts([])
  }

  const on = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }
  function edit(p) {
    setEditingId(p.id)
    setForm({ ...EMPTY, ...p, tags: (p.tags || []).join(', ') })
    setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function reset() { setEditingId(null); setForm(EMPTY); setMsg('') }

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    try {
      const db = getDb()
      const { collection, addDoc, doc, updateDoc } = await import('firebase/firestore')
      const data = {
        title: form.title.trim(),
        slug: (form.slug || slugify(form.title)).trim(),
        category: form.category, subcategory: form.subcategory.trim(),
        summary: form.summary.trim(), content: form.content.trim(),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        naver_url: form.naver_url.trim(),
        corner: form.corner || null, forecastYear: form.forecastYear || null, archiveVerdict: form.archiveVerdict || null,
        published_at: form.published_at || todayStr(),
        updated_at: todayStr(),
        display_order: Number(form.display_order) || 100,
        is_home: !!form.is_home, is_featured: !!form.is_featured, is_pinned: !!form.is_pinned,
        status: form.status, author: '양성길',
      }
      if (editingId) {
        await updateDoc(doc(db, 'posts', editingId), data)
        setMsg('✓ 수정되었습니다.')
      } else {
        await addDoc(collection(db, 'posts'), { ...data, views: 0 })
        setMsg('✓ 새 글이 등록되었습니다.')
      }
      reset(); await loadPosts()
    } catch (e) { setMsg('저장 오류: ' + e.message) }
    setBusy(false)
  }
  async function remove(p) {
    if (!confirm(`"${p.title}" 글을 삭제할까요?`)) return
    try {
      const db = getDb()
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'posts', p.id)); await loadPosts()
    } catch (e) { setMsg('삭제 오류: ' + e.message) }
  }

  if (!ready) return <section className="section"><div className="container"><p>불러오는 중…</p></div></section>

  if (!user) {
    return (
      <section className="section"><div className="container" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Admin</span>
        <h1 className="section-title" style={{ marginBottom: 18 }}>관리자 로그인</h1>
        <form className="form" onSubmit={login}>
          <div className="field"><label htmlFor="e">이메일</label><input id="e" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} required /></div>
          <div className="field"><label htmlFor="p">비밀번호</label><input id="p" type="password" value={pw} onChange={(ev) => setPw(ev.target.value)} required /></div>
          {err && <p style={{ color: '#c0392b', marginBottom: 12 }}>{err}</p>}
          <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>로그인</button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: '.86rem', marginTop: 14 }}>
          Firebase 콘솔 → Authentication 에서 만든 관리자 계정으로 로그인하세요.
        </p>
      </div></section>
    )
  }

  return (
    <section className="section"><div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div><span className="eyebrow">Admin</span><h1 className="section-title">글 관리</h1></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>{user.email}</span>
          <button className="btn btn--outline" onClick={logout}>로그아웃</button>
        </div>
      </div>

      {msg && <p style={{ padding: '10px 14px', background: 'var(--blue-50)', borderRadius: 10, marginBottom: 16, color: 'var(--blue-700)' }}>{msg}</p>}

      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        {/* 작성/수정 폼 */}
        <form className="form" onSubmit={save}>
          <h3 style={{ marginBottom: 14 }}>{editingId ? '글 수정' : '새 글 작성'}</h3>
          <div className="field"><label>제목 *</label><input name="title" value={form.title} onChange={on} required /></div>
          <div className="field"><label>슬러그 (URL, 비우면 자동)</label><input name="slug" value={form.slug} onChange={on} placeholder="예: 2030-ai-agent" /></div>
          <div className="field"><label>카테고리 *</label>
            <select name="category" value={form.category} onChange={on} style={selStyle}>
              {ALL_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.groupKo} · {c.ko}</option>)}
            </select>
          </div>
          <div className="field"><label>서브카테고리</label><input name="subcategory" value={form.subcategory} onChange={on} /></div>
          <div className="field"><label>요약</label><textarea name="summary" value={form.summary} onChange={on} style={{ minHeight: 70 }} /></div>
          <div className="field"><label>본문 *</label><textarea name="content" value={form.content} onChange={on} required style={{ minHeight: 180 }} placeholder="문단은 빈 줄로 구분됩니다." /></div>
          <div className="field"><label>태그 (쉼표로 구분)</label><input name="tags" value={form.tags} onChange={on} placeholder="인공지능, 미래예측" /></div>
          <div className="field"><label>네이버 원문 URL</label><input name="naver_url" value={form.naver_url} onChange={on} placeholder="https://blog.naver.com/intel007/..." /></div>
          <div className="field"><label>코너</label>
            <select name="corner" value={form.corner} onChange={on} style={selStyle}>
              <option value="">일반</option><option value="insight">Future Insight</option>
              <option value="forecast">Future Forecast</option><option value="archive">Future Archive</option>
            </select>
          </div>
          {form.corner === 'forecast' && <div className="field"><label>전망 연도 (2030/2040/2050)</label><input name="forecastYear" value={form.forecastYear} onChange={on} /></div>}
          {form.corner === 'archive' && <div className="field"><label>아카이브 평가 (예: 일부 적중)</label><input name="archiveVerdict" value={form.archiveVerdict} onChange={on} /></div>}
          <div className="grid grid--2" style={{ gap: 12 }}>
            <div className="field"><label>작성일 (비우면 오늘)</label><input name="published_at" value={form.published_at} onChange={on} placeholder="2025-11-02" /></div>
            <div className="field"><label>노출 순서</label><input name="display_order" type="number" value={form.display_order} onChange={on} /></div>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '4px 0 16px' }}>
            <label style={ck}><input type="checkbox" name="is_home" checked={form.is_home} onChange={on} /> 홈 노출</label>
            <label style={ck}><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={on} /> 대표글</label>
            <label style={ck}><input type="checkbox" name="is_pinned" checked={form.is_pinned} onChange={on} /> 추천(상단고정)</label>
          </div>
          <div className="field"><label>상태</label>
            <select name="status" value={form.status} onChange={on} style={selStyle}>
              <option value="published">공개(published)</option><option value="draft">임시저장(draft)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--primary" disabled={busy} style={{ flex: 1, justifyContent: 'center' }}>{busy ? '저장 중…' : editingId ? '수정 저장' : '글 등록'}</button>
            {editingId && <button type="button" className="btn btn--outline" onClick={reset}>취소</button>}
          </div>
        </form>

        {/* 글 목록 */}
        <div>
          <h3 style={{ marginBottom: 14 }}>등록된 글 ({posts.length})</h3>
          {posts.length === 0 && <p style={{ color: 'var(--muted)' }}>아직 글이 없습니다. 왼쪽에서 첫 글을 등록해 보세요.</p>}
          <div style={{ display: 'grid', gap: 10 }}>
            {posts.map((p) => (
              <div key={p.id} className="card" style={{ padding: '14px 16px' }}>
                <div className="postcard__meta" style={{ marginBottom: 6 }}>
                  {p.is_pinned && <span className="chip chip--pin">추천</span>}
                  <span className="chip">{p.category}</span>
                  <span>{p.published_at}</span>
                  {p.status !== 'published' && <span style={{ color: '#c0392b' }}>· {p.status}</span>}
                </div>
                <strong style={{ display: 'block', marginBottom: 8 }}>{p.title}</strong>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn--outline" style={btnSm} onClick={() => edit(p)}>수정</button>
                  <Link className="btn btn--outline" style={btnSm} href={`/futuresalon/${p.category}/${p.slug}`} target="_blank">보기</Link>
                  <button className="btn btn--outline" style={{ ...btnSm, color: '#c0392b' }} onClick={() => remove(p)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div></section>
  )
}

const selStyle = { width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10, font: 'inherit', background: 'var(--soft)' }
const ck = { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.92rem', color: '#33415a' }
const btnSm = { padding: '7px 14px', fontSize: '.85rem' }
