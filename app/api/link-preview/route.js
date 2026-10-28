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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url || !/^https?:\/\//i.test(url)) {
    return Response.json({ error: '올바른 URL을 입력해 주세요.' }, { status: 400 })
  }
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

    return Response.json({ title, summary, thumbnail, sourceUrl: url })
  } catch (e) {
    return Response.json({ error: '링크를 읽는 중 오류가 발생했습니다: ' + e.message }, { status: 500 })
  }
}
