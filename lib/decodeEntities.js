// 네이버 블로그 og 태그 등에서 들어온 HTML 엔티티(&lsquo; &rdquo; &amp;lsquo; &#39; 등)를
// 실제 문자(‘ ” ' …)로 바꿔 줍니다. 이중 인코딩(&amp;lsquo;)도 풀리도록 여러 번 반복합니다.
const NAMED = {
  amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', sbquo: '‚', bdquo: '„',
  lsaquo: '‹', rsaquo: '›', laquo: '«', raquo: '»',
  hellip: '…', middot: '·', bull: '•', ndash: '–', mdash: '—',
  prime: '′', Prime: '″', deg: '°', times: '×', divide: '÷',
  copy: '©', reg: '®', trade: '™', euro: '€', yen: '¥', pound: '£', cent: '¢',
  rarr: '→', larr: '←', uarr: '↑', darr: '↓', harr: '↔',
  hearts: '♥', star: '☆', starf: '★', sim: '∼', tilde: '˜', ensp: ' ', emsp: ' ', thinsp: ' ', zwj: '', zwnj: '',
}

function decodeOnce(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10)
      try { return Number.isFinite(code) ? String.fromCodePoint(code) : m } catch { return m }
    }
    return Object.prototype.hasOwnProperty.call(NAMED, body) ? NAMED[body] : m
  })
}

export function decodeEntities(s) {
  if (typeof s !== 'string' || !s.includes('&')) return s
  let prev
  let out = s
  for (let i = 0; i < 3 && out !== prev; i++) {
    prev = out
    out = decodeOnce(out)
  }
  return out
}

// 글 객체의 제목·요약을 정리해서 돌려줍니다.
export function cleanPost(p) {
  if (!p) return p
  return { ...p, title: decodeEntities(p.title), summary: decodeEntities(p.summary) }
}
