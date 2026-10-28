// 네이버 이미지 CDN(pstatic.net 등)은 Referer가 네이버 도메인이 아니면 이미지 요청을
// 막는다(핫링크 방지). 그래서 <img src="https://insightconsulting.kr/api/image-proxy?url=...">
// 로 우리 서버를 거치게 하고, 서버에서 Referer를 blog.naver.com 으로 붙여 대신 가져온 뒤
// 그대로 스트리밍해 돌려준다.
export const dynamic = 'force-dynamic'

const ALLOWED_HOSTS = [/\.pstatic\.net$/i, /\.naver\.net$/i]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const src = searchParams.get('url')
  if (!src || !/^https?:\/\//i.test(src)) {
    return new Response('올바른 이미지 URL이 아닙니다.', { status: 400 })
  }

  let host
  try {
    host = new URL(src).hostname
  } catch {
    return new Response('올바른 이미지 URL이 아닙니다.', { status: 400 })
  }
  if (!ALLOWED_HOSTS.some((re) => re.test(host))) {
    return new Response('허용되지 않은 이미지 호스트입니다.', { status: 403 })
  }

  try {
    const res = await fetch(src, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Referer: 'https://blog.naver.com/',
      },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok || !res.body) {
      return new Response('이미지를 가져오지 못했습니다.', { status: 502 })
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (e) {
    return new Response('이미지 프록시 오류: ' + e.message, { status: 500 })
  }
}
