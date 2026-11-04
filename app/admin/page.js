'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getDb, getAuthClient, getStorageClient } from '@/lib/firebase'
import { ALL_CATEGORIES } from '@/lib/categories'
import { getAllTravelPostsForAdmin, TRAVEL_COLLECTION } from '@/lib/travel'
import { proxiedImageUrl } from '@/lib/imageProxy'

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

      <ContentAdmin />
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

/* ========================= 글 등록 (미래살롱 / 세계여행 통합) ========================= */

// 등록 위치별 설정. 미래살롱은 posts, 세계여행은 travel_posts 컬렉션에 저장됩니다.
const TYPES = {
  salon: { label: '미래살롱', collection: 'posts', folder: 'post-thumbnails' },
  travel: { label: '양성길의세계여행', collection: TRAVEL_COLLECTION, folder: 'travel-thumbnails' },
}

const EMPTY_FORM = {
  // 공통
  naver_url: '', title: '', summary: '', thumbnail: '',
  published_at: '', display_order: 100, is_featured: false, status: 'published',
  // 미래살롱 전용
  category: 'ai', content: '', tags: '', slug: '', subcategory: '',
  corner: '', forecastYear: '', archiveVerdict: '', is_home: true, is_pinned: false,
}

const msgStyle = { padding: '10px 14px', background: 'var(--blue-50)', borderRadius: 10, marginBottom: 16, color: 'var(--blue-700)' }

function ContentAdmin() {
  const [type, setType] = useState('salon') // 기본: 미래살롱
  const [listTab, setListTab] = useState('salon')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [salonPosts, setSalonPosts] = useState([])
  const [travelPosts, setTravelPosts] = useState([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => { loadSalon(); loadTravel() }, [])

  async function loadSalon() {
    try {
      const db = getDb()
      const { collection, getDocs } = await import('firebase/firestore')
      const snap = await getDocs(collection(db, 'posts'))
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      rows.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
      setSalonPosts(rows)
    } catch (e) { setMsg('미래살롱 목록 로드 오류: ' + e.message) }
  }
  async function loadTravel() {
    try { setTravelPosts(await getAllTravelPostsForAdmin()) }
    catch (e) { setMsg('세계여행 목록 로드 오류: ' + e.message) }
  }

  const on = (e) => {
    const { name, value, type: t, checked } = e.target
    setForm((f) => ({ ...f, [name]: t === 'checkbox' ? checked : value }))
  }
  function chooseType(t) {
    if (editingId) return // 수정 중에는 등록 위치를 바꾸지 않음
    setType(t); setListTab(t)
  }

  async function fetchPreview() {
    const url = form.naver_url.trim()
    if (!url) { setMsg('먼저 네이버 블로그 글 주소를 입력해 주세요.'); return }
    setFetching(true); setMsg('')
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '가져오기 실패')
      // 이미 작성한 제목·요약은 덮어쓰지 않고, 비어 있을 때만 채웁니다.
      setForm((f) => ({
        ...f,
        title: f.title || data.title || '',
        summary: f.summary || data.summary || '',
        thumbnail: data.thumbnail || f.thumbnail,
      }))
      setMsg('✓ 제목·요약·대표 이미지를 불러왔습니다. 필요하면 수정 후 등록하세요.')
    } catch (e) {
      setMsg('불러오기 오류: ' + e.message + ' — 아래 칸에 직접 입력해 주세요.')
    }
    setFetching(false)
  }

  function edit(p, t) {
    setType(t); setListTab(t); setEditingId(p.id)
    setForm({ ...EMPTY_FORM, ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '') })
    setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  // 저장 직후 성공 메시지가 지워지지 않도록 메시지는 따로 관리합니다.
  function reset() { setEditingId(null); setForm(EMPTY_FORM) }
  function cancel() { reset(); setMsg('') }

  async function save(e) {
    e.preventDefault()
    const cfg = TYPES[type]
    const title = (form.title || '').trim()
    const url = (form.naver_url || '').trim()
    if (!title) { setMsg('제목이 비어 있습니다. "가져오기"를 누르거나 직접 입력해 주세요.'); return }
    if (type === 'travel' && !url) { setMsg('세계여행은 네이버 블로그 글 주소가 필요합니다.'); return }

    const common = {
      naver_url: url, title,
      summary: (form.summary || '').trim(),
      thumbnail: (form.thumbnail || '').trim(),
      published_at: form.published_at || todayStr(),
      updated_at: todayStr(),
      display_order: Number(form.display_order) || 100,
      is_featured: !!form.is_featured,
      status: form.status,
    }
    const data = type === 'salon' ? {
      ...common,
      slug: (form.slug || slugify(title)).trim(),
      category: form.category, subcategory: (form.subcategory || '').trim(),
      // 링크로 등록한 글은 본문을 비워도 됩니다 — 이때는 요약을 본문으로 씁니다.
      content: (form.content || '').trim() || common.summary,
      tags: String(form.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      corner: form.corner || null, forecastYear: form.forecastYear || null, archiveVerdict: form.archiveVerdict || null,
      is_home: !!form.is_home, is_pinned: !!form.is_pinned,
      author: '양성길',
    } : common

    setBusy(true); setMsg('')
    try {
      const db = getDb()
      const { collection, addDoc, doc, updateDoc } = await import('firebase/firestore')
      if (editingId) {
        await updateDoc(doc(db, cfg.collection, editingId), data)
        setMsg(`✓ ${cfg.label} 글을 수정했습니다.`)
      } else {
        await addDoc(collection(db, cfg.collection), type === 'salon' ? { ...data, views: 0 } : data)
        setMsg(`✓ ${cfg.label}에 등록했습니다.`)
      }
      reset()
      await (type === 'salon' ? loadSalon() : loadTravel())
    } catch (e) { setMsg('저장 오류: ' + e.message) }
    setBusy(false)
  }

  async function remove(p, t) {
    if (!confirm(`"${p.title}" 글을 삭제할까요?`)) return
    try {
      const db = getDb()
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, TYPES[t].collection, p.id))
      if (editingId === p.id) reset()
      await (t === 'salon' ? loadSalon() : loadTravel())
      setMsg('✓ 삭제했습니다.')
    } catch (e) { setMsg('삭제 오류: ' + e.message) }
  }

  const isSalon = type === 'salon'
  const list = listTab === 'salon' ? salonPosts : travelPosts

  return (
    <>
      <p style={{ color: 'var(--muted)', marginBottom: 18, fontSize: '.95rem' }}>
        네이버 블로그 글 주소를 넣고 <strong>가져오기</strong>를 누르면 제목·요약·대표 이미지를 자동으로 채워줍니다. 등록 위치를 고른 뒤 등록하세요.
      </p>
      {msg && <p style={msgStyle}>{msg}</p>}

      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        <form className="form" onSubmit={save}>
          <h3 style={{ marginBottom: 14 }}>{editingId ? `${TYPES[type].label} 글 수정` : '새 글 등록'}</h3>

          <div className="field">
            <label>등록 위치</label>
            <div role="radiogroup" aria-label="등록 위치" style={{ display: 'flex', gap: 8 }}>
              {Object.entries(TYPES).map(([k, c]) => (
                <button key={k} type="button" role="radio" aria-checked={type === k} onClick={() => chooseType(k)}
                  disabled={!!editingId && type !== k}
                  className={type === k ? 'btn btn--primary' : 'btn btn--outline'}
                  style={{ flex: 1, justifyContent: 'center', opacity: editingId && type !== k ? 0.4 : 1 }}>
                  {c.label}
                </button>
              ))}
            </div>
            {editingId && <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginTop: 6 }}>수정 중에는 등록 위치를 바꿀 수 없습니다.</p>}
          </div>

          <div className="field">
            <label>네이버 블로그 글 주소{isSalon ? '' : ' *'}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="naver_url" value={form.naver_url} onChange={on} required={!isSalon}
                placeholder="https://blog.naver.com/intel007/..." style={{ flex: 1 }} />
              <button type="button" className="btn btn--outline" onClick={fetchPreview} disabled={fetching} style={{ whiteSpace: 'nowrap' }}>
                {fetching ? '불러오는 중…' : '가져오기'}
              </button>
            </div>
          </div>

          <ThumbnailField value={form.thumbnail} folder={TYPES[type].folder} setMsg={setMsg}
            onChange={(url) => setForm((f) => ({ ...f, thumbnail: url }))} />

          <div className="field"><label>제목 *</label><input name="title" value={form.title} onChange={on} required /></div>
          <div className="field"><label>요약</label><textarea name="summary" value={form.summary} onChange={on} style={{ minHeight: 80 }} /></div>

          {isSalon && (
            <>
              <div className="field"><label>카테고리 *</label>
                <select name="category" value={form.category} onChange={on} style={selStyle}>
                  {ALL_CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.groupKo} · {c.ko}</option>)}
                </select>
              </div>
              <div className="field"><label>본문 (비우면 요약을 본문으로 사용)</label>
                <textarea name="content" value={form.content} onChange={on} style={{ minHeight: 140 }} placeholder="문단은 빈 줄로 구분됩니다." />
              </div>
              <div className="field"><label>태그 (쉼표로 구분)</label><input name="tags" value={form.tags} onChange={on} placeholder="인공지능, 미래예측" /></div>
              <details style={{ margin: '4px 0 14px' }}>
                <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '.9rem' }}>추가 설정 (슬러그 · 서브카테고리 · 코너)</summary>
                <div style={{ marginTop: 12 }}>
                  <div className="field"><label>슬러그 (URL, 비우면 제목으로 자동)</label><input name="slug" value={form.slug} onChange={on} placeholder="예: 2030-ai-agent" /></div>
                  <div className="field"><label>서브카테고리</label><input name="subcategory" value={form.subcategory} onChange={on} /></div>
                  <div className="field"><label>코너</label>
                    <select name="corner" value={form.corner || ''} onChange={on} style={selStyle}>
                      <option value="">일반</option><option value="insight">Future Insight</option>
                      <option value="forecast">Future Forecast</option><option value="archive">Future Archive</option>
                    </select>
                  </div>
                  {form.corner === 'forecast' && <div className="field"><label>전망 연도 (2030/2040/2050)</label><input name="forecastYear" value={form.forecastYear || ''} onChange={on} /></div>}
                  {form.corner === 'archive' && <div className="field"><label>아카이브 평가 (예: 일부 적중)</label><input name="archiveVerdict" value={form.archiveVerdict || ''} onChange={on} /></div>}
                </div>
              </details>
            </>
          )}

          <div className="grid grid--2" style={{ gap: 12 }}>
            <div className="field"><label>작성일 (비우면 오늘)</label><input name="published_at" value={form.published_at} onChange={on} placeholder="2025-11-02" /></div>
            <div className="field"><label>노출 순서</label><input name="display_order" type="number" value={form.display_order} onChange={on} /></div>
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', margin: '4px 0 16px' }}>
            {isSalon ? (
              <>
                <label style={ck}><input type="checkbox" name="is_home" checked={!!form.is_home} onChange={on} /> 홈 노출</label>
                <label style={ck}><input type="checkbox" name="is_featured" checked={!!form.is_featured} onChange={on} /> 대표글</label>
                <label style={ck}><input type="checkbox" name="is_pinned" checked={!!form.is_pinned} onChange={on} /> 추천(상단고정)</label>
              </>
            ) : (
              <label style={ck}><input type="checkbox" name="is_featured" checked={!!form.is_featured} onChange={on} /> 대표 여행기</label>
            )}
          </div>
          <div className="field"><label>상태</label>
            <select name="status" value={form.status} onChange={on} style={selStyle}>
              <option value="published">공개(published)</option><option value="draft">임시저장(draft)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn--primary" disabled={busy} style={{ flex: 1, justifyContent: 'center' }}>
              {busy ? '저장 중…' : editingId ? '수정 저장' : `${TYPES[type].label}에 등록`}
            </button>
            {editingId && <button type="button" className="btn btn--outline" onClick={cancel}>취소</button>}
          </div>
        </form>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, borderBottom: '1px solid var(--line)' }}>
            <button type="button" onClick={() => setListTab('salon')} style={tabBtn(listTab === 'salon')}>미래살롱 ({salonPosts.length})</button>
            <button type="button" onClick={() => setListTab('travel')} style={tabBtn(listTab === 'travel')}>세계여행 ({travelPosts.length})</button>
          </div>
          {list.length === 0 && <p style={{ color: 'var(--muted)' }}>아직 등록된 글이 없습니다.</p>}
          <div style={{ display: 'grid', gap: 10 }}>
            {list.map((p) => (
              <div key={p.id} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 14, outline: editingId === p.id ? '2px solid var(--blue-600)' : 'none' }}>
                {p.thumbnail
                  ? <img src={proxiedImageUrl(p.thumbnail)} alt="" style={{ width: 84, height: 64, objectFit: 'cover', borderRadius: 8, flex: 'none' }} />
                  : <div style={{ width: 84, height: 64, borderRadius: 8, background: 'var(--soft)', flex: 'none' }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="postcard__meta" style={{ marginBottom: 4 }}>
                    {listTab === 'salon' && p.is_pinned && <span className="chip chip--pin">추천</span>}
                    {listTab === 'travel' && p.is_featured && <span className="chip chip--pin">대표</span>}
                    {listTab === 'salon' && <span className="chip">{p.category}</span>}
                    <span>{p.published_at}</span>
                    {p.status !== 'published' && <span style={{ color: '#c0392b' }}>· {p.status}</span>}
                  </div>
                  <strong style={{ display: 'block', marginBottom: 8 }}>{p.title}</strong>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn--outline" style={btnSm} onClick={() => edit(p, listTab)}>수정</button>
                    {listTab === 'salon' && <Link className="btn btn--outline" style={btnSm} href={`/futuresalon/${p.category}/${encodeURIComponent(p.slug)}`} target="_blank">보기</Link>}
                    {p.naver_url && <a className="btn btn--outline" style={btnSm} href={p.naver_url} target="_blank" rel="noreferrer">원문</a>}
                    <button className="btn btn--outline" style={{ ...btnSm, color: '#c0392b' }} onClick={() => remove(p, listTab)}>삭제</button>
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

/* ========================= 공용: 대표 이미지(썸네일) 입력 ========================= */

// 미리보기 + URL 입력 + 파일 업로드 + 삭제. 미래살롱/세계여행 폼이 함께 사용합니다.
// folder: Storage 업로드 경로 (storage.rules에서 쓰기를 허용한 폴더여야 함)
function ThumbnailField({ value, onChange, folder, setMsg }) {
  const [uploading, setUploading] = useState(false)

  async function upload(e) {
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
      const fileRef = ref(storage, `${folder}/${Date.now()}-${safeName}`)
      await uploadBytes(fileRef, file, { contentType: file.type })
      onChange(await getDownloadURL(fileRef))
      setMsg('✓ 대표 이미지를 업로드했습니다.')
    } catch (e) {
      setMsg('업로드 오류: ' + (e.message || String(e)))
    }
    setUploading(false)
  }

  async function remove() {
    const current = value
    onChange('')
    // 우리가 직접 업로드한 파일(folder/ 경로)이면 Storage에서도 함께 지워 안 쓰는 이미지가 쌓이지 않도록 한다.
    // 블로그에서 가져온 외부 이미지 URL이면 건드리지 않는다.
    if (current && current.includes(`${folder}%2F`)) {
      try {
        const storage = getStorageClient()
        const { ref, deleteObject } = await import('firebase/storage')
        await deleteObject(ref(storage, current))
      } catch {
        // 이미 지워졌거나 권한 문제 등은 조용히 무시 — 화면에서 썸네일은 이미 비워졌음
      }
    }
    setMsg('✓ 대표 이미지를 삭제했습니다.')
  }

  return (
    <div className="field">
      <label>대표 이미지 (썸네일)</label>
      {value && (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img src={proxiedImageUrl(value)} alt="" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)', display: 'block' }} />
          <button type="button" onClick={remove} title="대표 이미지 삭제"
            style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(15,23,42,.72)', color: '#fff', fontSize: '1rem', lineHeight: 1, cursor: 'pointer' }}>
            ✕
          </button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="자동으로 채워지거나 직접 입력" style={{ flex: 1 }} />
        <label className="btn btn--outline" style={{ ...btnSm, whiteSpace: 'nowrap', cursor: uploading ? 'default' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
          {uploading ? '업로드 중…' : '파일로 추가'}
          <input type="file" accept="image/*" onChange={upload} disabled={uploading} style={{ display: 'none' }} />
        </label>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginTop: 6 }}>블로그에서 자동으로 가져오거나, URL을 직접 입력하거나, 내 컴퓨터에 있는 이미지를 올릴 수 있습니다. (최대 8MB)</p>
    </div>
  )
}
