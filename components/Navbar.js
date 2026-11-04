'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getAuthClient } from '@/lib/firebase'
import { SITE, NAV } from '@/lib/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)
  const router = useRouter()

  // 좌상단 로고 더블클릭 → PIN 입력 → 관리자 페이지 (PIN 확인은 서버 /api/admin/login 에서)
  const [pinOpen, setPinOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [pinErr, setPinErr] = useState('')
  const [pinBusy, setPinBusy] = useState(false)
  const openPin = () => { setPin(''); setPinErr(''); setPinOpen(true) }
  async function submitPin(e) {
    e.preventDefault(); setPinErr(''); setPinBusy(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '로그인 실패')
      const { signInWithCustomToken } = await import('firebase/auth')
      await signInWithCustomToken(getAuthClient(), data.token)
      setPinOpen(false)
      router.push('/admin')
    } catch (err) {
      setPinErr(err.message || '로그인 실패'); setPin('')
    }
    setPinBusy(false)
  }
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" className="brand" onClick={close} onDoubleClick={openPin}>
          <img src="/logo.png" alt="인싸이트컨설팅 로고" className="brand__logo" width="40" height="40" />
          <span className="brand__text">
            <span className="brand__ko">{SITE.company}</span>
            <span className="brand__en">Insight Consulting</span>
          </span>
        </Link>

        <nav className={open ? 'nav__links nav__links--open' : 'nav__links'}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={close} className={isActive(n.href) ? 'active' : undefined}>
              {n.label}
            </Link>
          ))}
          <Link href="/travel" onClick={close} className={isActive('/travel') ? 'active' : undefined}>양성길의세계여행</Link>
          <Link href="/profile#contact" className="btn btn--primary nav__cta" onClick={close}>강의 문의</Link>
        </nav>

        <button className="nav__toggle" aria-label="메뉴" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>

    </header>

    {pinOpen && (
      <div className="pinmodal" role="dialog" aria-modal="true" aria-label="관리자 PIN 입력" onClick={() => setPinOpen(false)}>
        <form className="pinmodal__box" onClick={(e) => e.stopPropagation()} onSubmit={submitPin}>
          <strong>관리자</strong>
          <input type="password" inputMode="numeric" autoComplete="off" autoFocus maxLength={12}
            value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" aria-label="PIN" />
          {pinErr && <p className="pinmodal__err">{pinErr}</p>}
          <div className="pinmodal__actions">
            <button type="button" className="btn btn--outline" onClick={() => setPinOpen(false)}>취소</button>
            <button className="btn btn--primary" disabled={pinBusy || !pin}>{pinBusy ? '확인 중…' : '들어가기'}</button>
          </div>
        </form>
      </div>
    )}
    </>
  )
}
