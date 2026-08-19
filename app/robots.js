import { SITE } from '@/lib/site'
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/members/private'] }],
    sitemap: `${SITE.domain}/sitemap.xml`,
  }
}
