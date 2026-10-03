#!/usr/bin/env node
/**
 * Content pipeline: content/blog/<category>/<slug>.md  →  public/content/*.json
 *
 * - Parses YAML frontmatter (gray-matter)
 * - Renders Markdown to HTML (marked) with syntax highlighting done at build
 *   time (highlight.js), so no highlighter ships to the browser
 * - Emits a lightweight index for listings and one JSON file per post
 * - Generates feed.xml (RSS) and sitemap.xml
 *
 * Usage:  node scripts/build-content.mjs [--drafts]
 * Env:    SITE_URL=https://your-domain.com  (used for RSS + sitemap)
 */
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { Marked } from 'marked';
import hljs from 'highlight.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const OUT_DIR = path.join(ROOT, 'public', 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CATEGORIES = ['personal', 'technical'];
const SITE_URL = (process.env.SITE_URL ?? 'https://aymanelbery.dev').replace(/\/$/, '');
const INCLUDE_DRAFTS = process.argv.includes('--drafts');
const WORDS_PER_MINUTE = 220;
const STATIC_ROUTES = ['/', '/projects', '/experience', '/blog', '/blog/personal', '/blog/technical'];

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

const toIsoDate = (value) => {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${value}`);
  return d.toISOString().slice(0, 10);
};

function createRenderer() {
  const headings = [];
  const used = new Map();
  let hasMermaid = false;

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) return `<h2>${inner}</h2>`; // the page owns the only <h1>
        const base = slugify(text) || 'section';
        const n = used.get(base) ?? 0;
        used.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        if (depth <= 3) headings.push({ id, depth, text: text.replace(/[`*_]/g, '') });
        return `<h${depth} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a></h${depth}>`;
      },
      code({ text, lang }) {
        const language = (lang ?? '').trim().split(/\s+/)[0].toLowerCase();
        if (language === 'mermaid') {
          hasMermaid = true;
          return `<pre class="mermaid">${escapeHtml(text)}</pre>`;
        }
        const highlighted =
          language && hljs.getLanguage(language)
            ? hljs.highlight(text, { language, ignoreIllegals: true }).value
            : escapeHtml(text);
        const langAttr = language ? ` data-lang="${escapeHtml(language)}"` : '';
        return `<pre${langAttr}><code class="hljs">${highlighted}</code></pre>`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        const ext = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(href)}"${t}${ext}>${inner}</a>`;
      },
      image({ href, title, text }) {
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${t} loading="lazy" decoding="async">`;
      },
    },
  });

  return { marked, headings, hasMermaid: () => hasMermaid };
}

async function readPosts() {
  const posts = [];
  for (const category of CATEGORIES) {
    const dir = path.join(CONTENT_DIR, category);
    if (!existsSync(dir)) continue;
    for (const file of await readdir(dir)) {
      if (!/\.mdx?$/.test(file) || file.startsWith('_')) continue;
      const raw = await readFile(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const where = `${category}/${file}`;
      for (const key of ['title', 'description', 'date']) {
        if (!data[key]) throw new Error(`[content] ${where}: missing required frontmatter "${key}"`);
      }
      if (data.draft && !INCLUDE_DRAFTS) continue;

      const slug = data.slug ?? file.replace(/\.mdx?$/, '');
      const { marked, headings, hasMermaid } = createRenderer();
      const html = await marked.parse(content);
      const words = content.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;

      posts.push({
        slug,
        category,
        url: `/blog/${category}/${slug}`,
        title: String(data.title),
        description: String(data.description),
        date: toIsoDate(data.date),
        updated: toIsoDate(data.updated),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        featured: Boolean(data.featured),
        draft: Boolean(data.draft),
        readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        html,
        headings,
        hasMermaid: hasMermaid(),
      });
    }
  }
  const seen = new Set();
  for (const p of posts) {
    const key = `${p.category}/${p.slug}`;
    if (seen.has(key)) throw new Error(`[content] duplicate slug: ${key}`);
    seen.add(key);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

function rss(posts) {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${SITE_URL}${p.url}</link>
      <guid>${SITE_URL}${p.url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${p.category}</category>
      <description>${escapeHtml(p.description)}</description>
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ayman Elbery — Writing</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on enterprise architecture, distributed systems and engineering leadership.</description>
${items}
  </channel>
</rss>
`;
}

function sitemap(posts) {
  const urls = [
    ...STATIC_ROUTES.map((r) => ({ loc: r })),
    ...posts.map((p) => ({ loc: p.url, lastmod: p.updated ?? p.date })),
  ];
  const body = urls
    .map((u) => `  <url><loc>${SITE_URL}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

async function main() {
  const started = performance.now();
  const posts = await readPosts();

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(path.join(OUT_DIR, 'posts'), { recursive: true });

  const index = posts.map(({ html, headings, hasMermaid, ...meta }) => meta);
  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  await writeFile(
    path.join(OUT_DIR, 'index.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), tags: allTags, posts: index }),
  );

  for (const post of posts) {
    const dir = path.join(OUT_DIR, 'posts', post.category);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${post.slug}.json`), JSON.stringify(post));
  }

  const published = posts.filter((p) => !p.draft);
  await writeFile(path.join(PUBLIC_DIR, 'feed.xml'), rss(published));
  await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap(published));

  const ms = Math.round(performance.now() - started);
  console.log(`[content] ${posts.length} post(s) → public/content  (${ms}ms)`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
