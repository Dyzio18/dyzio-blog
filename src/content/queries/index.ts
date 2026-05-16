import type { PostDocument, AuthorDocument, StaticPageDocument } from '../schema/types'
import { contentRepository } from '../repository/content-repository'

export type PostMode = 'travel' | 'dev' | 'default'

const TRAVEL_TAGS = new Set([
  'travel', 'podroze', 'travels',
  'azja', 'amazonia', 'nepal', 'maroko', 'afryka',
  'korea', 'indonezja', 'tajlandia', 'peru', 'kolumbia', 'brazylia',
  'ameryka-poludniowa', 'agadir', 'bangkok', 'chiang-mai', 'bali', 'seul',
  'hiking', 'trekking', 'mountains',
])

const DEV_TAGS = new Set([
  'dev', 'ai', 'frontend',
  'javascript', 'typescript', 'js', 'ts',
  'react', 'next.js', 'nextjs', 'redux', 'redux-saga',
  'node.js', 'nodejs', 'express.js', 'nest.js',
  'ssr', 'csv', 'english',
])

export function getPostMode(tags: string[] | undefined): PostMode {
  if (!tags || tags.length === 0) return 'default'
  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-')
    if (TRAVEL_TAGS.has(slug)) return 'travel'
  }
  for (const tag of tags) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-')
    if (DEV_TAGS.has(slug)) return 'dev'
  }
  return 'default'
}

export type CorePost = Omit<PostDocument, 'bodyRaw' | 'bodyCode'> & { mode: PostMode }
export type CoreAuthor = Omit<AuthorDocument, 'bodyRaw' | 'bodyCode'>
export type CorePage = Omit<StaticPageDocument, 'bodyRaw' | 'bodyCode'>

export function sortPosts(posts: PostDocument[]): PostDocument[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
}

export function coreContent(post: PostDocument): CorePost {
  const { bodyRaw, bodyCode, ...rest } = post
  return { ...rest, mode: getPostMode(rest.tags) }
}

export function coreAuthor(author: AuthorDocument): CoreAuthor {
  const { bodyRaw, bodyCode, ...rest } = author
  return rest as CoreAuthor
}

export function corePage(page: StaticPageDocument): CorePage {
  const { bodyRaw, bodyCode, ...rest } = page
  return rest as CorePage
}

export function allCoreContent(posts: PostDocument[]): CorePost[] {
  return posts.map(coreContent)
}

export function getAllPosts(): PostDocument[] {
  return contentRepository.getAllPosts()
}

export function getAllPostsSorted(): PostDocument[] {
  return sortPosts(getAllPosts())
}

export function getPostBySlug(slug: string): PostDocument | undefined {
  return contentRepository.getPostBySlug(slug)
}

export function getAllAuthors(): AuthorDocument[] {
  return contentRepository.getAllAuthors()
}

export function getAuthorBySlug(slug: string): AuthorDocument | undefined {
  return contentRepository.getAuthorBySlug(slug)
}

export function getAllPages(): StaticPageDocument[] {
  return contentRepository.getAllPages()
}

export function getPageBySlug(slug: string): StaticPageDocument | undefined {
  return contentRepository.getPageBySlug(slug)
}

export function getRelatedPosts(slug: string, tags: string[] | undefined, limit = 3): CorePost[] {
  if (!tags || tags.length === 0) return [];
  const all = allCoreContent(getAllPostsSorted())
    .filter((p) => p.slug !== slug && !p.draft);
  const scored = all.map((p) => {
    const overlap = (p.tags || []).filter((t) => tags.includes(t)).length;
    return { post: p, overlap };
  });
  return scored
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((s) => s.post);
}

export function getTagCounts(): Record<string, number> {
  const posts = getAllPosts()
  const tagCounts: Record<string, number> = {}

  for (const post of posts) {
    if (post.draft !== true && post.tags) {
      for (const tag of post.tags) {
        const slug = tag.toLowerCase().replace(/\s+/g, '-')
        tagCounts[slug] = (tagCounts[slug] || 0) + 1
      }
    }
  }

  return tagCounts
}