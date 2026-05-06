import type { PostDocument, AuthorDocument, StaticPageDocument } from '../schema/types'
import { contentRepository } from '../repository/content-repository'

export type CorePost = Omit<PostDocument, 'bodyRaw' | 'bodyCode'>
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
  return rest as CorePost
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