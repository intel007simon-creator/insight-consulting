/** @type {import('next').NextConfig} */
const nextConfig = {
  // 강의·컨설팅, 저서·미디어 페이지는 양성길대표(/profile) 페이지로 통합됨 — 기존 링크·검색 노출 유지용 영구 이동
  async redirects() {
    return [
      { source: '/lecture', destination: '/profile#lecture', permanent: true },
      { source: '/media', destination: '/profile#media', permanent: true },
    ]
  },
};

export default nextConfig;
