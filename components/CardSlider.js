'use client'
import { useRef, useState } from 'react'

// 양성길대표 명함 슬라이드 — 좌우로 넘겨 보는 이미지 슬라이더 (모바일은 스와이프, 데스크톱은 화살표·점)
export default function CardSlider({ slides }) {
  const track = useRef(null)
  const [idx, setIdx] = useState(0)

  const go = (i) => {
    const el = track.current
    if (!el) return
    const n = (i + slides.length) % slides.length
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    if (el) setIdx(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="cardslider">
      <div className="cardslider__track" ref={track} onScroll={onScroll}>
        {slides.map((s, i) => (
          <div className="cardslider__slide" key={s.src} aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>
            <img src={s.src} alt={s.alt} width="1920" height="1080" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
      <button type="button" className="cardslider__nav cardslider__nav--prev" onClick={() => go(idx - 1)} aria-label="이전 명함">‹</button>
      <button type="button" className="cardslider__nav cardslider__nav--next" onClick={() => go(idx + 1)} aria-label="다음 명함">›</button>
      <div className="cardslider__dots">
        {slides.map((s, i) => (
          <button type="button" key={s.src} className={i === idx ? 'active' : undefined} onClick={() => go(i)} aria-label={`${i + 1}번째 명함 보기`} />
        ))}
      </div>
    </div>
  )
}
