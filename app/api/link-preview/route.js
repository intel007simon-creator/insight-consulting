// 서버에서 외부 URL(네이버 블로그 등)을 대신 가져와 og:title/og:description/og:image를 추출합니다.
// 브라우저에서 직접 요청하면 CORS에 막히기 때문에 어드민 폼이 이 라우트를 통해 호출합니다.
export const dynamic = 'force-dynamic'

function decodeEntities(s) {
  if (!s) return s
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

function extractMeta(html, keys) {
  const metaTags = html.match(/<meta\s+[^>]*>/gi) || []
  const result = {}
  for (const tag of metaTags) {
    const propMatch = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i)
    const contentMatch = tag.match(/content\s*=\s*["']([^"']*)["']/i)
    if (!propMatch || !contentMatch) continue
    const key = propMatch[1].toLowerCase()
    if (keys.includes(key) && !result[key]) result[key] = contentMatch[1]
  }
  return result
}

// blog.naver.com 의 글 페이지는 프레임셋(frameset) 구조라서 최상위 HTML에는
// 실제 글의 og:title/og:image가 들어있지 않고, 블로그 전체에 대한 일반 정보만 담겨 있다.
// m.blog.naver.com(모바일 버전)은 프레임 없이 글 내용을 그대로 서버에서 렌더링하므로
// 해당 글의 실제 제목·썸네일이 og 태그에 정확히 들어있다. 그래서 데스크톱 주소가 오면
// 모바일 주소로 바꿔서 가져온다 — 글 제목·썸네일을 "그대로" 가져오기 위한 핵심 처리.
function normalizeNaverUrl(inputUrl) {
  try {
    const u = new URL(inputUrl)
    if (/(^|\.)blog\.naver\.com$/i.test(u.hostname) && u.hostname !== 'm.blog.naver.com') {
      u.hostname = 'm.blog.naver.com'
    }
    return u.toString()
  } catch {
    return inputUrl
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get('url')
  if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
    return Response.json({ error: '올바른 URL을 입력해 주세요.' }, { status: 400 })
  }
  const url = normalizeNaverUrl(rawUrl)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return Response.json({ error: `원문을 가져오지 못했습니다 (HTTP ${res.status})` }, { status: 502 })
    const html = await res.text()

    const meta = extractMeta(html, ['og:title', 'og:description', 'og:image', 'twitter:title', 'twitter:description', 'twitter:image'])
    const titleTagMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)

    const title = decodeEntities(meta['og:title'] || meta['twitter:title'] || (titleTagMatch ? titleTagMatch[1] : '')) || ''
    const summary = decodeEntities(meta['og:description'] || meta['twitter:description'] || '') || ''
    let thumbnail = decodeEntities(meta['og:image'] || meta['twitter:image'] || '') || ''
    if (thumbnail && thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail

    return Response.json({ title, summary, thumbnail, sourceUrl: rawUrl })
  } catch (e) {
    return Response.json({ error: '링크를 읽는 중 오류가 발생했습니다: ' + e.message }, { status: 500 })
  }
}
