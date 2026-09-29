# Portfolio launch readiness

Audit date: September 28, 2026. Design, case-study copy, typography, and layouts preserved. The unfinished Contact invitation reuses the existing footer statement; Work metadata reuses the existing introduction.

## Fixed

- Added Sharp as an explicit dependency: production image generation previously failed.
- Added canonical URLs, Open Graph and Twitter metadata using the existing portrait.
- Added a sitemap for all 13 public pages and robots.txt. Production allows indexing; previews and builds without a site origin remain excluded. The 404 page is noindex.
- Replaced the Contact placeholder and placeholder Work metadata.
- Added Vercel build settings and excluded local deployment state, logs, private keys, and environment files from Git.
- Removed personal absolute filesystem paths from the internal artifact audit.

## Verification

- Production type check and build passed: 14 HTML pages, including the 404 page. Four pre-existing non-blocking hints concern deprecated iframe attributes and the font-loading handler.
- All 386 local asset/link references resolved, including fragment links and the resume download.
- All 11 external destinations checked returned HTTP 200 after redirects, including the map embed, font stylesheet, LSC links, and the resume website.
- Browser checks across all 14 pages at 375, 768, and 1440 pixels found no document overflow, missing alt attributes, unnamed controls, duplicate IDs, or JavaScript errors. Images loaded in the completed responsive pass. A separate faster accessibility pass encountered some images still loading, not missing files.
- Axe WCAG A/AA automated checks found no violations on all 14 pages at 375 pixels. This is a basic automated audit, not an accessibility certification; third-party embedded content is not fully covered.
- Resume PDF opened, text extraction passed, and its one-page rendering was reviewed. It contains the intended public email, city, and website.
- Common secret/token/private-key patterns were scanned without printing values; no matches were found. No file exceeds GitHub's 100 MB single-file limit. Source artwork totals about 88 MB, so the first upload may take time. Large original screenshots remain a performance optimization opportunity.
- Production and preview builds were compared: production uses index/follow and Allow; preview uses noindex/follow and Disallow.
- Original artwork may contain original template text; it was preserved as supplied. No client artifacts or metrics were rewritten.

## Git and deployment

The supplied GitHub repository is https://github.com/arianasch2108/portfolio. It was empty when inspected. The local branch is main; origin points to that repository. No history was overwritten.

Vercel setup:

1. Import that GitHub repository into Vercel after the initial push.
2. Use the repository root and Astro framework preset. The checked-in settings run `pnpm build` and serve `dist`.
3. Enable `ENABLE_EXPERIMENTAL_COREPACK=1` so Vercel uses the pinned `pnpm@11.25.0`. Keep the lockfile. Select a supported Node version satisfying `>=22.12.0` (Node 22 is suitable).
4. Keep Automatically expose System Environment Variables enabled. The build can use `VERCEL_PROJECT_PRODUCTION_URL` as its public origin. Alternatively, set `SITE_URL` to the actual HTTPS origin, without a path, query, or fragment, in Production and Preview. Do not use the temporary audit origin.
5. Deploy and check the public homepage, all eight projects, resume PDF, 404, robots.txt, sitemap.xml, canonical URLs, and social image. Review the public URL before changing any existing domain/DNS settings.
6. When adding a custom domain, verify it in Vercel, set SITE_URL to that domain, and redeploy so canonical and sitemap URLs update.

No Vercel project or public deployment has been created by this audit. GitHub authentication and a Vercel account are required for the remaining remote steps.

References: https://docs.astro.build/en/guides/deploy/vercel/ ; https://vercel.com/docs/builds/configure-a-build ; https://vercel.com/docs/environment-variables/system-environment-variables
