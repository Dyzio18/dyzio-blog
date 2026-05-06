import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import siteMetadata from '../data/siteMetadata.js';

const CONTENT_DIR = path.join(process.cwd(), 'data');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

function getAllBlogFiles(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  let result = [];

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      result = result.concat(getAllBlogFiles(filePath));
    } else if (/\.(mdx?|md)$/.test(file.name)) {
      const relativePath = path.relative(BLOG_DIR, filePath).replace(/\\/g, '/');
      const slug = relativePath.replace(/\.(mdx?|md)$/, '');
      result.push({ path: filePath, slug });
    }
  }

  return result;
}

function dateSortDesc(a, b) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

function createSearchIndex(blogFiles) {
  if (siteMetadata?.search?.provider !== 'local' || !siteMetadata.search.indexPath) {
    return;
  }

  const outputPath = path.join('public', siteMetadata.search.indexPath);

  const searchIndex = blogFiles
    .map(({ path: filePath, slug }) => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      if (data.draft === true) {
        return null;
      }

      return {
        id: slug,
        slug,
        path: `blog/${slug}`,
        sourcePath: filePath.replace(process.cwd() + '/', ''),
        title: data.title || '',
        date: data.date || '',
        summary: data.summary || '',
        tags: data.tags || [],
        authors: data.authors || ['default'],
      };
    })
    .filter(Boolean)
    .sort((a, b) => dateSortDesc(a.date, b.date));

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(searchIndex));
}

function main() {
  const blogFiles = getAllBlogFiles(BLOG_DIR);

  createSearchIndex(blogFiles);
  console.log('Content assets generated...');
}

main();