import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { escape } from 'pliny/utils/htmlEscaper.js';
import siteMetadata from '../data/siteMetadata.js';

const slugifyTag = (tag) => new GithubSlugger().slug(tag);
const tagData = JSON.parse(readFileSync(new URL('../app/tag-data.json', import.meta.url), 'utf8'));

// Load blog frontmatter directly from MDX files — no compilation needed for RSS
function loadBlogPosts() {
  const blogDir = fileURLToPath(new URL('../data/blog', import.meta.url));
  const results = [];

  function walk(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(mdx?|md)$/.test(entry.name)) {
        try {
          const raw = readFileSync(full, 'utf-8');
          const { data: fm } = matter(raw);
          const rel = path.relative(blogDir, full).replace(/\\/g, '/');
          const slug = rel.replace(/\.(mdx?|md)$/, '');
          results.push({
            slug,
            title: fm.title || '',
            date: fm.date ? String(fm.date).split('T')[0] : '',
            summary: fm.summary || '',
            tags: Array.isArray(fm.tags) ? fm.tags : [],
            draft: fm.draft ?? false,
          });
        } catch { /* skip malformed files */ }
      }
    }
  }

  walk(blogDir);
  results.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  return results;
}

const allBlogs = loadBlogPosts();

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/blog/${post.slug}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/blog/${post.slug}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`;

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`;

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publishPosts = allBlogs.filter((post) => post.draft !== true);
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, publishPosts);
    writeFileSync(`./public/${page}`, rss);
  }

  if (publishPosts.length > 0) {
    for (const tag of Object.keys(tagData)) {
      const filteredPosts = allBlogs.filter((post) =>
        post.tags.map((t) => slugifyTag(t)).includes(tag)
      );
      const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`);
      const rssPath = path.join('public', 'tags', tag);
      mkdirSync(rssPath, { recursive: true });
      writeFileSync(path.join(rssPath, page), rss);
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs);
  console.log('RSS feed generated...');
};
export default rss;
