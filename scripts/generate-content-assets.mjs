import { mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
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

function sortPosts(posts, dateKey = 'date') {
  return [...posts].sort((left, right) => dateSortDesc(left[dateKey], right[dateKey]));
}

function omit(content, keys) {
  const result = { ...content };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

function coreContent(content) {
  return omit(content, ['body', '_raw', '_id']);
}

function createTagCount(blogFiles) {
  const tagCount = {};

  for (const { path: filePath } of blogFiles) {
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (!data.tags || data.draft === true) {
      continue;
    }

    const tags = Array.isArray(data.tags) ? data.tags : data.tags.split(',').map((t) => t.trim());
    for (const tag of tags) {
      const formattedTag = new GithubSlugger().slug(tag);
      tagCount[formattedTag] = (tagCount[formattedTag] || 0) + 1;
    }
  }

  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount));
}

function createSearchIndex(blogFiles) {
  if (
    siteMetadata?.search?.provider !== 'kbar' ||
    !siteMetadata.search.kbarConfig?.searchDocumentsPath
  ) {
    return;
  }

  const outputPath = path.join('public', siteMetadata.search.kbarConfig.searchDocumentsPath);

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

  createTagCount(blogFiles);
  createSearchIndex(blogFiles);
  console.log('Content assets generated...');
}

main();