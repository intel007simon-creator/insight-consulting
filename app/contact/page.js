'use client'
import { useState } from 'react'
import { SITE } from '@/lib/site'

export default function Contact() {
  const [f, setF] = useState({ name: '', contact: '', message: '' })
  const on = (e) => setF((s) => ({ ...s, [e.target.name]: e.target.value }))
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[홈페이지 문의] ${f.name || '무제'}`)
    const body = encodeURIComponent(`이름/소속: ${f.name}\n연락처: ${f.contact}\n\n${f.message}`)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`
  }
  return (
    <>
      <section className="pagehero"><div className="container">
        <span className="eyebrow" style={{ color: '#a9c2f5' }}>Contact</span>
        <h1>문의하기</h1><p>강의, 컨설팅, 협업 제안을 환영합니다.</p>
      </div></section>
      <section className="section"><div className="container contact-grid">
        <div>
          <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>연락처</h2>
          <div className="contact-item"><div className="contact-item__ic">📞</div><div><small>전화</small><a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a></div></div>
          <div className="contact-item"><div className="contact-item__ic">✉️</div><div><small>이메일</small><a href={`mailto:${SITE.email}`}>{SITE.email}</a></div></div>
          <div className="contact-item"><div className="contact-item__ic">📝</div><div><small>블로그</small><a href={SITE.blog} target="_blank" rel="noreferrer">양성길의 세계여행</a></div></div>
          <div className="contact-item"><div className="contact-item__ic">▶️</div><div><small>유튜브</small><a href={SITE.youtube} target="_blank" rel="noreferrer">양성길TV</a></div></div>
          <div className="contact-item" style={{ borderBottom: 'none' }}><div className="contact-item__ic">📸</div><div><small>인스타그램</small><a href={SITE.instagram} target="_blank" rel="noreferrer">@intel007simon</a></div></div>
        </div>
        <form className="form" onSubmit={submit}>
          <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: 16 }}>메시지 보내기</h2>
          <div className="field"><label htmlFor="name">이름 / 소속</label><input id="name" name="name" value={f.name} onChange={on} placeholder="홍길동 / 인싸이트컨설팅" required /></div>
          <div className="field"><label htmlFor="contact">연락처 (이메일 또는 전화)</label><input id="contact" name="contact" value={f.contact} onChange={on} placeholder="example@email.com" required /></div>
          <div className="field"><label htmlFor="message">문의 내용</label><textarea id="message" name="message" value={f.message} onChange={on} placeholder="강의 주제, 일정, 대상 인원 등을 적어 주세요." required /></div>
          <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>메일로 문의 보내기</button>
          <p style={{ marginTop: 10, fontSize: '.84rem', color: 'var(--muted)', textAlign: 'center' }}>버튼을 누르면 메일 앱이 열립니다.</p>
        </form>
      </div></section>
    </>
  )
}
