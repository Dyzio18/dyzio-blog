import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { compileSync } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import GithubSlugger from 'github-slugger'
import type { PostDocument, AuthorDocument, StaticPageDocument, TocHeading } from '../schema/types'
import siteMetadata from '../../../data/siteMetadata'

const ROOT = process.cwd()
const DATA_DIR = path.join(ROOT, 'data')

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function extractTocSync(raw: string): TocHeading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TocHeading[] = []
  const slugger = new GithubSlugger()
  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(raw)) !== null) {
    const depth = match[1].length
    const value = match[2].replace(/\*\*(.+?)\*\*/g, '$1').replace(/`(.+?)`/g, '$1').trim()
    const url = '#' + slugger.slug(value)
    toc.push({ value, url, depth })
  }
  return toc
}

function compileMdx(content: string): string {
  const result = compileSync(content, {
    outputFormat: 'function-body' as const,
    // @ts-ignore - plugin tuple types are narrower than compileSync expects in this stack
    remarkPlugins: [remarkGfm, remarkMath],
    // @ts-ignore - plugin tuple types are narrower than compileSync expects in this stack
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex],
  })
  return String(result)
}

function getMdxFiles(dir: string): string[] {
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    const files: string[] = []
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...getMdxFiles(full))
      } else if (/\.(mdx?|md)$/.test(entry.name)) {
        files.push(full)
      }
    }
    return files
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export function loadAllPosts(): PostDocument[] {
  const blogDir = path.join(DATA_DIR, 'blog')
  const files = getMdxFiles(blogDir)
  const posts: PostDocument[] = []

  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const { data: fm, content } = matter(raw)

      const relPath = path.relative(blogDir, filePath).replace(/\\/g, '/')
      const slug = relPath.replace(/\.(mdx?|md)$/, '')
      const docPath = `blog/${slug}`
      const sourceFilePath = path.relative(ROOT, filePath).replace(/\\/g, '/')

      const rt = readingTime(content)
      const toc = extractTocSync(content)
      const bodyCode = compileMdx(content)

      const post: PostDocument = {
        kind: 'post',
        id: `blog/${slug}`,
        slug,
        path: docPath,
        filePath: sourceFilePath,
        toc,
        bodyRaw: content,
        bodyCode,
        readingTime: { text: rt.text, minutes: rt.minutes, words: rt.words },
        title: fm.title || '',
        date: fm.date ? String(fm.date).split('T')[0] : '',
        lastmod: fm.lastmod ? String(fm.lastmod).split('T')[0] : undefined,
        draft: fm.draft ?? false,
        summary: fm.summary,
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        images: fm.images,
        authors: Array.isArray(fm.authors) ? fm.authors : ['default'],
        layout: fm.layout,
        bibliography: fm.bibliography,
        canonicalUrl: fm.canonicalUrl,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: fm.title,
          datePublished: fm.date,
          dateModified: fm.lastmod || fm.date,
          description: fm.summary,
          image: fm.images?.[0] ?? siteMetadata.socialBanner,
          url: `${siteMetadata.siteUrl}/${docPath}`,
          author: fm.authors ?? ['default'],
        },
      }

      posts.push(post)
    } catch (err) {
      console.error(`[mdx-reader] Failed to load ${filePath}:`, err)
    }
  }

  return posts
}

// ---------------------------------------------------------------------------
// Authors
// ---------------------------------------------------------------------------

export function loadAllAuthors(): AuthorDocument[] {
  const authorsDir = path.join(DATA_DIR, 'authors')
  const files = getMdxFiles(authorsDir)
  const authors: AuthorDocument[] = []

  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const { data: fm, content } = matter(raw)

      const relPath = path.relative(authorsDir, filePath).replace(/\\/g, '/')
      const slug = relPath.replace(/\.(mdx?|md)$/, '')
      const docPath = `authors/${slug}`
      const sourceFilePath = path.relative(ROOT, filePath).replace(/\\/g, '/')

      const rt = readingTime(content)
      const toc = extractTocSync(content)
      const bodyCode = compileMdx(content)

      const author: AuthorDocument = {
        kind: 'author',
        id: `authors/${slug}`,
        slug,
        path: docPath,
        filePath: sourceFilePath,
        toc,
        bodyRaw: content,
        bodyCode,
        readingTime: { text: rt.text, minutes: rt.minutes, words: rt.words },
        name: fm.name || '',
        avatar: fm.avatar,
        occupation: fm.occupation,
        company: fm.company,
        email: fm.email,
        twitter: fm.twitter,
        linkedin: fm.linkedin,
        github: fm.github,
        instagram: fm.instagram,
        layout: fm.layout,
      }

      authors.push(author)
    } catch (err) {
      console.error(`[mdx-reader] Failed to load ${filePath}:`, err)
    }
  }

  return authors
}

// ---------------------------------------------------------------------------
// CMS / static pages
// ---------------------------------------------------------------------------

export function loadAllPages(): StaticPageDocument[] {
  const cmsDir = path.join(DATA_DIR, 'cms')
  const files = getMdxFiles(cmsDir)
  const pages: StaticPageDocument[] = []

  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, 'utf-8')
      const { data: fm, content } = matter(raw)

      const relPath = path.relative(cmsDir, filePath).replace(/\\/g, '/')
      const slug = relPath.replace(/\.(mdx?|md)$/, '')
      const docPath = `cms/${slug}`
      const sourceFilePath = path.relative(ROOT, filePath).replace(/\\/g, '/')

      const rt = readingTime(content)
      const toc = extractTocSync(content)
      const bodyCode = compileMdx(content)

      const page: StaticPageDocument = {
        kind: 'page',
        id: `cms/${slug}`,
        slug,
        path: docPath,
        filePath: sourceFilePath,
        toc,
        bodyRaw: content,
        bodyCode,
        readingTime: { text: rt.text, minutes: rt.minutes, words: rt.words },
        date: fm.date ? String(fm.date).split('T')[0] : undefined,
        name: fm.name,
        title: fm.title,
      }

      pages.push(page)
    } catch (err) {
      console.error(`[mdx-reader] Failed to load ${filePath}:`, err)
    }
  }

  return pages
}
