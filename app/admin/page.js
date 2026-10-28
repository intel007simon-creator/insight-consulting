'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDb, getAuthClient, getStorageClient } from '@/lib/firebase'
import { ALL_CATEGORIES } from '@/lib/categories'
import { getAllTravelPostsForAdmin, TRAVEL_COLLECTION } from '@/lib/travel'

function todayStr() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
function slugify(s) {
  return (s || '').toString().trim().toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
}

const selStyle = { width: '100%', padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10, font: 'inherit', background: 'var(--soft)' }
const ck = { display: 'flex', alignItems: 'center', gap: 6, fontSize: '.92rem', color: '#33415a' }
const btnSm = { padding: '7px 14px', fontSize: '.85rem' }

export default function Admin() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('posts')

  useEffect(() => {
    const auth = getAuthClient()
    if (!auth) { setReady(true); return }
    let unsub
    ;(async () => {
      const { onAuthStateChanged } = await import('firebase/auth')
      unsub = onAuthStateChanged(auth, (u) => { setUser(u); setReady(true) })
    })()
    return () => unsub && unsub()
  }, [])

  async function login(e) {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pw }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '로그인 실패')
      const auth = getAuthClient()
      const { signInWithCustomToken } = await import('firebase/auth')
      await signInWithCustomToken(auth, data.token)
    } catch (e) {
      setErr(e.message || '로그인 실패')
    } finally {
      setBusy(false)
    }
  }
  async function logout() {
    const auth = getAuthClient()
    const { signOut } = await import('firebase/auth')
    await signOut(auth); setUser(null)
  }

  if (!ready) return <section className="section"><div className="container"><p>불러오는 중…</p></div></section>

  if (!user) {
    return (
      <section className="section"><div className="container" style={{ maxWidth: 420 }}>
        <span className="eyebrow">Admin</span>
        <h1 className="section-title" style={{ marginBottom: 18 }}>관리자 로그인</h1>
        <form className="form" onSubmit={login}>
          <div className="field"><label htmlFor="e">아이디</label><input id="e" type="text" autoComplete="username" value={username} onChange={(ev) => setUsername(ev.target.value)} required /></div>
          <div className="field"><label htmlFor="p">비밀번호</label><input id="p" type="password" autoComplete="current-password" value={pw} onChange={(ev) => setPw(ev.target.value)} required /></div>
          {err && <p style={{ color: '#c0392b', marginBottom: 12 }}>{err}</p>}
          <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} disabled={busy}>{busy ? '확인 중…' : '로그인'}</button>
        </form>
      </div></section>
    )
  }

  return (
    <section className="section"><div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div><span className="eyebrow">Admin</span><h1 className="section-title">콘텐츠 관리</h1></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>관리자</span>
          <button className="btn btn--outline" onClick={logout}>로그아웃</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '1px solid var(--line)' }}>
        <button onClick={() => setTab('posts')} style={tabBtn(tab === 'posts')}>미래살롱 글</button>
        <button onClick={() => setTab('travel')} style={tabBtn(tab === 'travel')}>양성길의 세계여행</button>
      </div>

      {tab === 'posts' ? <PostsAdmin /> : <TravelAdmin />}
    </div></section>
  )
}

function tabBtn(active) {
  return {
    padding: '10px 18px', fontWeight: 700, fontSize: '.95rem', background: 'none', border: 'none',
    borderBottom: active ? '2px solid var(--blue-600)' : '2px solid transparent',
    color: active ? 'var(--blue-700)' : 'var(--muted)', cursor: 'pointer',
  }
}

/* ========================= 미래살롱 글 관리 ========================= */

const EMPTY_POST = {
  title: '', slug: '', category: 'ai', subcategory: '', summary: '', content: '',
  tags: '', naver_url: '', corner: '', forecastYear: '', archiveVerdict: '',
  published_at: '', display_order: 100, is_home: true, is_featured: false, is_pinned: false, status: 'published',
}

function PostsAdmin() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(EMPTY_POST)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { loadPosts() }, [])

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

  const on = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }
  function edit(p) {
    setEditingId(p.id)
    setForm({ ...EMPTY_POST, ...p, tags: (p.tags || []).join(', ') })
    setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function reset() { setEditingId(null); setForm(EMPTY_POST); setMsg('') }

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

  return (
    <>
      {msg && <p style={{ padding: '10px 14px', background: 'var(--blue-50)', borderRadius: 10, marginBottom: 16, color: 'var(--blue-700)' }}>{msg}</p>}
      <div className="grid grid--2" style={{ alignItems: 'start' }}>
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
    </>
  )
}

/* ========================= 양성길의 세계여행 관리 ========================= */

const EMPTY_TRAVEL = {
  naver_url: '', title: '', summary: '', thumbnail: '',
  published_at: '', display_order: 100, is_featured: false, status: 'published',
}

function TravelAdmin() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(EMPTY_TRAVEL)
  const [editingId, setEditingId] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    try {
      const rows = await getAllTravelPostsForAdmin()
      setPosts(rows)
    } catch (e) { setMsg('목록 로드 오류: ' + e.message) }
  }

  async function uploadThumbnail(e) {
    const file = e.target.files && e.target.files[0]
    e.target.value = '' // 같은 파일을 다시 골라도 onChange가 매번 발생하도록 초기화
    if (!file) return
    if (!file.type.startsWith('image/')) { setMsg('이미지 파일만 업로드할 수 있습니다.'); return }
    if (file.size > 8 * 1024 * 1024) { setMsg('이미지 용량은 8MB 이하여야 합니다.'); return }

    setUploading(true); setMsg('')
    try {
      const storage = getStorageClient()
      if (!storage) throw new Error('Firebase Storage가 설정되어 있지 않습니다.')
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
      const path = `travel-thumbnails/${Date.now()}-${safeName}`
      const fileRef = ref(storage, path)
      await uploadBytes(fileRef, file, { contentType: file.type })
      const url = await getDownloadURL(fileRef)
      setForm((f) => ({ ...f, thumbnail: url }))
      setMsg('✓ 썸네일 이미지를 업로드했습니다.')
    } catch (e) {
      setMsg('업로드 오류: ' + (e.message || String(e)))
    }
    setUploading(false)
  }

  async function removeThumbnail() {
    const current = form.thumbnail
    setForm((f) => ({ ...f, thumbnail: '' }))
    // 우리가 직접 업로드한 파일(travel-thumbnails/ 경로)이면 Storage에서도 함께 지워
    // 안 쓰는 이미지가 쌓이지 않도록 한다. 블로그에서 가져온 외부 이미지 URL이면 건드리지 않는다.
    if (current && /travel-thumbnails%2F/.test(current)) {
      try {
        const storage = getStorageClient()
        const { ref, deleteObject } = await import('firebase/storage')
        await deleteObject(ref(storage, current))
      } catch {
        // 이미 지워졌거나 권한 문제 등은 조용히 무시 — 화면에서 썸네일은 이미 비워졌음
      }
    }
    setMsg('✓ 썸네일을 삭제했습니다.')
  }

  const on = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function fetchPreview() {
    const url = form.naver_url.trim()
    if (!url) { setMsg('먼저 네이버 블로그 글 주소를 입력해 주세요.'); return }
    setFetching(true); setMsg('')
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '가져오기 실패')
      setForm((f) => ({
        ...f,
        title: data.title || f.title,
        summary: data.summary || f.summary,
        thumbnail: data.thumbnail || f.thumbnail,
      }))
      setMsg('✓ 제목·요약·썸네일을 불러왔습니다. 필요하면 아래에서 수정 후 등록하세요.')
    } catch (e) {
      setMsg('불러오기 오류: ' + e.message + ' — 아래 칸에 직접 입력해 주세요.')
    }
    setFetching(false)
  }

  function edit(p) {
    setEditingId(p.id)
    setForm({ ...EMPTY_TRAVEL, ...p })
    setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function reset() { setEditingId(null); setForm(EMPTY_TRAVEL); setMsg('') }

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) { setMsg('제목이 비어 있습니다. "가져오기"를 누르거나 직접 입력해 주세요.'); return }
    setBusy(true); setMsg('')
    try {
      const db = getDb()
      const { collection, addDoc, doc, updateDoc } = await import('firebase/firestore')
      const data = {
        naver_url: form.naver_url.trim(),
        title: form.title.trim(),
        summary: form.summary.trim(),
        thumbnail: form.thumbnail.trim(),
        published_at: form.published_at || todayStr(),
        updated_at: todayStr(),
        display_order: Number(form.display_order) || 100,
        is_featured: !!form.is_featured,
        status: form.status,
      }
      if (editingId) {
        await updateDoc(doc(db, TRAVEL_COLLECTION, editingId), data)
        setMsg('✓ 수정되었습니다.')
      } else {
        await addDoc(collection(db, TRAVEL_COLLECTION), data)
        setMsg('✓ 새 여행기가 등록되었습니다.')
      }
      reset(); await loadPosts()
    } catch (e) { setMsg('저장 오류: ' + e.message) }
    setBusy(false)
  }
  async function remove(p) {
    if (!confirm(`"${p.title}" 여행기를 삭제할까요?`)) return
    try {
      const db = getDb()
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, TRAVEL_COLLECTION, p.id)); await loadPosts()
    } catch (e) { setMsg('삭제 오류: ' + e.message) }
  }

  return (
    <>
      <p style={{ color: 'var(--muted)', marginBottom: 18, fontSize: '.95rem' }}>
        네이버 블로그 글 주소를 넣고 <strong>가져오기</strong>를 누르면 제목·요약·썸네일을 자동으로 채워줍니다. 내용은 등록 전에 자유롭게 수정할 수 있어요.
      </p>
      {msg && <p style={{ padding: '10px 14px', background: 'var(--blue-50)', borderRadius: 10, marginBottom: 16, color: 'var(--blue-700)' }}>{msg}</p>}

      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        <form className="form" onSubmit={save}>
          <h3 style={{ marginBottom: 14 }}>{editingId ? '여행기 수정' : '새 여행기 등록'}</h3>

          <div className="field">
            <label>네이버 블로그 글 주소 *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="naver_url" value={form.naver_url} onChange={on} required
                placeholder="https://blog.naver.com/intel007/..." style={{ flex: 1 }} />
              <button type="button" className="btn btn--outline" onClick={fetchPreview} disabled={fetching} style={{ whiteSpace: 'nowrap' }}>
                {fetching ? '불러오는 중…' : '가져오기'}
              </button>
            </div>
          </div>

          {form.thumbnail && (
            <div className="field">
              <label>썸네일 미리보기</label>
              <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <img src={form.thumbnail} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)', display: 'block' }} />
                <button type="button" onClick={removeThumbnail} title="썸네일 삭제"
                  style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(15,23,42,.72)', color: '#fff', fontSize: '1rem', lineHeight: 1, cursor: 'pointer' }}>
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="field"><label>제목 *</label><input name="title" value={form.title} onChange={on} required /></div>
          <div className="field"><label>요약</label><textarea name="summary" value={form.summary} onChange={on} style={{ minHeight: 80 }} /></div>
          <div className="field">
            <label>썸네일 이미지 URL</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="thumbnail" value={form.thumbnail} onChange={on} placeholder="자동으로 채워지거나 직접 입력" style={{ flex: 1 }} />
              <label className="btn btn--outline" style={{ ...btnSm, whiteSpace: 'nowrap', cursor: uploading ? 'default' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
                {uploading ? '업로드 중…' : '파일로 추가'}
                <input type="file" accept="image/*" onChange={uploadThumbnail} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginTop: 6 }}>블로그에서 자동으로 가져오거나, URL을 직접 입력하거나, 내 컴퓨터에 있는 이미지를 올릴 수 있습니다. (최대 8MB)</p>
          </div>

          <div className="grid grid--2" style={{ gap: 12 }}>
            <div className="field"><label>작성일 (비우면 오늘)</label><input name="published_at" value={form.published_at} onChange={on} placeholder="2018-02-20" /></div>
            <div className="field"><label>노출 순서</label><input name="display_order" type="number" value={form.display_order} onChange={on} /></div>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '4px 0 16px' }}>
            <label style={ck}><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={on} /> 대표 여행기</label>
          </div>
          <div className="field"><label>상태</label>
            <select name="status" value={form.status} onChange={on} style={selStyle}>
              <option value="published">공개(published)</option><option value="draft">임시저장(draft)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--primary" disabled={busy} style={{ flex: 1, justifyContent: 'center' }}>{busy ? '저장 중…' : editingId ? '수정 저장' : '여행기 등록'}</button>
            {editingId && <button type="button" className="btn btn--outline" onClick={reset}>취소</button>}
          </div>
        </form>

        <div>
          <h3 style={{ marginBottom: 14 }}>등록된 여행기 ({posts.length})</h3>
          {posts.length === 0 && <p style={{ color: 'var(--muted)' }}>아직 등록된 여행기가 없습니다.</p>}
          <div style={{ display: 'grid', gap: 10 }}>
            {posts.map((p) => (
              <div key={p.id} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 14 }}>
                {p.thumbnail
                  ? <img src={p.thumbnail} alt="" style={{ width: 84, height: 64, objectFit: 'cover', borderRadius: 8, flex: 'none' }} />
                  : <div style={{ width: 84, height: 64, borderRadius: 8, background: 'var(--soft)', flex: 'none' }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="postcard__meta" style={{ marginBottom: 4 }}>
                    {p.is_featured && <span className="chip chip--pin">대표</span>}
                    <span>{p.published_at}</span>
                    {p.status !== 'published' && <span style={{ color: '#c0392b' }}>· {p.status}</span>}
                  </div>
                  <strong style={{ display: 'block', marginBottom: 8 }}>{p.title}</strong>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn--outline" style={btnSm} onClick={() => edit(p)}>수정</button>
                    <a className="btn btn--outline" style={btnSm} href={p.naver_url} target="_blank" rel="noreferrer">원문</a>
                    <button className="btn btn--outline" style={{ ...btnSm, color: '#c0392b' }} onClick={() => remove(p)}>삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
