# Ayman Elbery — Engineering Portfolio

Personal site: portfolio, case studies with architecture diagrams, and a Markdown-powered blog.

**Stack:** Angular 22 (standalone, signals, zoneless) · Tailwind CSS 4 · Lucide icons · Markdown via `marked` + `highlight.js` (build time) · Mermaid (lazy-loaded, only on posts that use it).

## Commands

```bash
npm install
npm start               # builds content, then runs ng serve on http://localhost:4200
npm run content:watch   # optional, in a 2nd terminal: rebuild posts when Markdown changes
npm run build           # builds content, then the production bundle → dist/ayman-elbery/browser
```

## Writing a post

1. Copy `content/blog/_TEMPLATE.md` into `content/blog/technical/` or `content/blog/personal/`.
2. Rename it. The file name becomes the URL, e.g. `content/blog/technical/my-post.md` → `/blog/technical/my-post`.
3. Fill in the frontmatter (`title`, `description` and `date` are required) and write Markdown.

Code fences are syntax-highlighted at build time. Fences marked ` ```mermaid ` render as diagrams.
Posts with `draft: true` are skipped unless you run `npm run content -- --drafts`.

`scripts/build-content.mjs` generates `public/content/*.json`, `public/feed.xml` (RSS) and `public/sitemap.xml`.
These files are git-ignored. Set `SITE_URL=https://your-domain` when building so RSS and the sitemap use absolute URLs.

## Editing site content

| What | Where |
| --- | --- |
| Profile, metrics, capabilities, experience, skills | `src/app/data/profile.ts` |
| Case studies and their architecture diagrams | `src/app/data/projects.ts` |
| Résumé download | `public/Ayman-Elbery-CV.pdf` |
| Design tokens (colours, fonts, grid, animations) | `src/styles.css` |

Diagrams are plain data: nodes use `x`/`y` centres in the diagram's own coordinate space, and edges
are routed automatically. On narrow screens a diagram keeps a legible minimum width and scrolls sideways.

## Deploying

The output is a static single-page app. Configure the host to serve `index.html` for unknown paths
(SPA fallback) so deep links like `/blog/technical/...` work. Netlify, Vercel, Cloudflare Pages,
Firebase Hosting and Nginx (`try_files $uri /index.html`) all support this.

## Motion & accessibility

- Every animation is disabled or reduced under `prefers-reduced-motion`. That covers scroll reveals,
  diagram packets, the grid drift and page transitions.
- Includes a skip link, visible focus rings, keyboard-traceable diagram nodes, and text alternatives
  for each diagram.
