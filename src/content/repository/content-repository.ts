import type { PostDocument, AuthorDocument, StaticPageDocument } from '../schema/types'
import { loadAllPosts, loadAllAuthors, loadAllPages } from '../storage/mdx-file-reader'

let postsCache: PostDocument[] | null = null
let authorsCache: AuthorDocument[] | null = null
let pagesCache: StaticPageDocument[] | null = null

function getAllPostsFromGenerated(): PostDocument[] {
  if (postsCache) return postsCache
  postsCache = loadAllPosts()
  return postsCache
}

function getAllAuthorsFromGenerated(): AuthorDocument[] {
  if (authorsCache) return authorsCache
  authorsCache = loadAllAuthors()
  return authorsCache
}

function getAllPagesFromGenerated(): StaticPageDocument[] {
  if (pagesCache) return pagesCache
  pagesCache = loadAllPages()
  return pagesCache
}

export class ContentRepository {
  getAllPosts(): PostDocument[] {
    return getAllPostsFromGenerated()
  }

  getPostBySlug(slug: string): PostDocument | undefined {
    return getAllPostsFromGenerated().find((p) => p.slug === slug)
  }

  getAllAuthors(): AuthorDocument[] {
    return getAllAuthorsFromGenerated()
  }

  getAuthorBySlug(slug: string): AuthorDocument | undefined {
    return getAllAuthorsFromGenerated().find((a) => a.slug === slug)
  }

  getAllPages(): StaticPageDocument[] {
    return getAllPagesFromGenerated()
  }

  getPageBySlug(slug: string): StaticPageDocument | undefined {
    return getAllPagesFromGenerated().find((p) => p.slug === slug)
  }

  clearCache() {
    postsCache = null
    authorsCache = null
    pagesCache = null
  }
}

export const contentRepository = new ContentRepository()