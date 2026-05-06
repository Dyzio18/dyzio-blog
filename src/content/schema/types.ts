export type ContentKind = 'post' | 'author' | 'page'

export interface TocHeading {
  value: string
  url: string
  depth: number
}

export interface BaseContentDocument {
  kind: ContentKind
  id: string
  slug: string
  path: string
  filePath: string
  toc: TocHeading[]
  bodyRaw: string
  bodyCode: string
  readingTime: {
    text: string
    minutes: number
    words: number
  }
}

export interface AuthorDocument extends BaseContentDocument {
  kind: 'author'
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  linkedin?: string
  github?: string
  instagram?: string
  layout?: string
}

export interface PostDocument extends BaseContentDocument {
  kind: 'post'
  title: string
  date: string
  lastmod?: string
  draft?: boolean
  summary?: string
  tags: string[]
  images?: string[]
  authors: string[]
  layout?: 'PostSimple' | 'PostLayout' | 'PostBanner'
  bibliography?: string
  canonicalUrl?: string
  structuredData: Record<string, unknown>
}

export interface StaticPageDocument extends BaseContentDocument {
  kind: 'page'
  name?: string
  title?: string
  date?: string
}

export type Post = PostDocument
export type Author = AuthorDocument
export type Page = StaticPageDocument