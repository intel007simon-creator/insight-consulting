// 네이버 이미지 CDN(pstatic.net 등)은 외부 도메인에서 바로 <img src>로 불러오면
// 핫링크 방지 정책 때문에 깨진 이미지(?)로 표시된다. 그런 호스트의 이미지만
// 우리 서버를 거쳐오는 /api/image-proxy 로 바꿔서, 서버에서 올바른 Referer를
// 붙여 대신 가져오게 한다. 우리가 직접 업로드한 Firebase Storage 이미지 등
// 다른 호스트는 그대로 둔다.
const HOTLINK_PROTECTED_HOSTS = [/\.pstatic\.net$/i, /\.naver\.net$/i]

export function proxiedImageUrl(url) {
  if (!url) return url
  let host
  try {
    host = new URL(url).hostname
  } catch {
    return url
  }
  if (HOTLINK_PROTECTED_HOSTS.some((re) => re.test(host))) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`
  }
  return url
}
