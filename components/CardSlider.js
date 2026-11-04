'use client'
import { useEffect, useRef, useState } from 'react'

const AUTOPLAY_MS = 4000

// 양성길대표 명함 슬라이드 — 4초마다 자동으로 넘어가고, 마지막 장 다음엔 처음으로 돌아갑니다.
// 마우스를 올리거나 터치·포커스 중이면 멈추고, 화면 밖이거나 다른 탭을 보고 있을 때도 멈춥니다.
// 사용자가 '동작 줄이기'(prefers-reduced-motion)를 켜 두었다면 자동 재생하지 않습니다.
export default function CardSlider({ slides }) {
  const root = useRef(null)
  const track = useRef(null)
  const idxRef = useRef(0)
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)

  const go = (i) => {
    const el = track.current
    if (!el) return
    const n = (i + slides.length) % slides.length
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    idxRef.current = i
    setIdx(i)
  }

  // 화면에 보일 때만 자동 재생
  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !visible || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      if (document.hidden) return
      go(idxRef.current + 1)
    }, AUTOPLAY_MS)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, visible, slides.length])

  const pause = () => setPaused(true)
  const resume = () => setPaused(false)

  return (
    <div
      className="cardslider"
      ref={root}
      aria-roledescription="carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
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
