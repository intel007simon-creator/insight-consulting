'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE, NAV } from '@/lib/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link href="/" className="brand" onClick={close}>
          <span className="brand__mark">IC</span>
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
          <Link href="/travel" onClick={close} className={isActive('/travel') ? 'active' : undefined}>양성길의 세계여행</Link>
          <Link href="/contact" className="btn btn--primary nav__cta" onClick={close}>강의 문의</Link>
        </nav>

        <button className="nav__toggle" aria-label="메뉴" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  )
}
