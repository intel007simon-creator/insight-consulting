import { SITE } from '@/lib/site'
import { ALL_CATEGORIES } from '@/lib/categories'
import { getAllPostRefs } from '@/lib/data'

export default async function sitemap() {
  const base = SITE.domain
  const staticPaths = ['', '/about', '/profile', '/lecture', '/futuresalon', '/travel', '/media', '/library', '/members', '/contact', '/search']
  const cats = ALL_CATEGORIES.map((c) => `/futuresalon/${c.slug}`)
  const posts = (await getAllPostRefs()).map((p) => `/futuresalon/${p.category}/${p.slug}`)
  const now = new Date()
  return [...staticPaths, ...cats, ...posts].map((path) => ({ url: `${base}${path}`, lastModified: now }))
}
