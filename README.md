# Portfolio starter

A responsive Astro portfolio for Ariana Sierra-Chacón, with an editorial homepage direction. Homepage copy and eight project summaries use supplied portfolio content. Project narratives remain clearly marked for a later phase; missing homepage assets use neutral surfaces without visible placeholder instructions. There is no invented client work, imagery, or performance data.

## Run locally

Use Node.js 22.12+ (Node 24 recommended) and pnpm 11.

```sh
pnpm install
pnpm dev
```

Open the local URL printed in the terminal (normally http://127.0.0.1:4321/).

```sh
pnpm check    # Check Astro and TypeScript
pnpm build    # Check content/types and generate the static site in dist/
pnpm preview  # Serve the production build locally
```

Dependencies are pinned in package.json and pnpm-lock.yaml. Use `pnpm install --frozen-lockfile` to reproduce the installed versions.

## Where to edit

- `src/content/pages/`: Home, Work, About, Resume, and Contact text in Markdown. Work's title, description, and introduction live in `work.md`.
- `src/content/projects/`: one Markdown file per project.
- `src/data/site.json`: display name, navigation, email, social links, and resume URL. JSON is used here to avoid an extra configuration parser.
- `src/assets/projects/`: real project images, when available.
- `src/styles/global.css`: shared responsive styles. The `:root` block groups tokens for colors, typography, spacing, content dimensions, borders, radius, shadows, and transition duration. The homepage uses dark hero/footer surfaces, pale-lilac Impact and resume sections, off-white case studies, and a plum Selected Projects section. System fonts require no external service.
- `src/layouts/`: global page and project templates.
- `src/pages/`: page URLs; project URLs are generated automatically.

## Add or update a project

1. Duplicate an existing project file in `src/content/projects/` with a new filename.
2. Change its `title`, `slug`, `summary`, and disciplines. A slug must be unique, lowercase, and hyphen-separated (for example `website-redesign`). It controls the URL `/work/website-redesign/`.
3. Choose `format: case-study` for a longer story or `format: brief` for a supporting project. Both use the same layout; write only the sections the project needs.
4. Use `order` to arrange projects (lower numbers first). Values like 10, 20, and 30 leave room to insert projects. Ties sort by title.
5. Set `featured: true` to include a case study in Home's **Featured case studies**. Home's **Selected projects** shows all published `brief` entries. All published projects appear on Work grouped by `format`. Each group preserves project order. `brief` describes presentation length, not a project source or institution.
6. Keep `draft: true` until ready. Drafts are excluded from listings and generated pages, including in local preview. If omitted, `draft` defaults to true.
7. Replace the placeholder body below the `---` metadata block. Use `##` for section headings; the template already provides the page's main heading.
8. Set `sample: false` after replacing all example content. Optional role, client, context, year, cover, results, and links can be omitted entirely. Use `context` for an optional label such as personal project or certificate program; no organization or source is required.
9. Preview the site and run `pnpm build` before publishing.

To remove a project, delete its Markdown file or mark it as a draft. You do not need to edit page code. Keep published slugs stable; changing one changes the URL and may require a hosting redirect later.

### Format-specific presentation

Both formats continue to use one project collection, route, card, grid, and project layout. `ProjectGrid` accepts `presentation="features"` for alternating editorial features; its default is a compact grid. `ProjectCard` handles both presentations. The homepage selects `presentation="reveals"` for compact briefs, using `ProjectBriefCard`: title, categories, and context are always visible; hover or keyboard focus reveals the summary and optional small cover image. On touch/narrow screens, the summary and CTA stay visible. The whole card is one native link, with no JavaScript or nested controls. Cards, sections, and detail articles expose `data-project-format`. Individual project page compositions remain unchanged for a later design phase.

`ProjectArtifact` provides a padded neutral image surface and an optional `thinking` text prop. If supplied, it renders a native keyboard/touch-accessible details disclosure. No project supplies this text yet; there is no flip animation or hover-only information. This component does not force a new content system or change project detail pages.

## Homepage copy and portrait

Edit `src/content/pages/home.md`. Its `homepage` metadata contains the eyebrow, short positioning line, three achievement positions, section headings/intros, and resume heading. The Markdown body is the supporting hero paragraph. Replace placeholder values and change the corresponding placeholder flags to `false` only once real copy or verified metrics are supplied.

To add a portrait, save it under `src/assets/` and add `portrait` within `homepage` with a relative `src` (for example `../../assets/portrait.jpg`) and descriptive `alt`. Omit it to retain the neutral portrait space.

Name, location, email, social links, and the editable closing statement are in `src/data/site.json`. The supplied closing statement preserves its intentional line breaks. `closingIsPlaceholder` is false.

Header navigation contains Work, About, and Contact. A LinkedIn link appears only when configured in `socialLinks`. Resume remains accessible through the homepage CTA and footer. Without a PDF, the CTA links to the existing resume page. The homepage uses the supplied supporting copy and does not display a missing-file message.

Disciplines are editable, nonempty labels in each project file; they do not require changes to the schema.

### Optional images, results, and links

Add an image under `src/assets/projects/your-project/`, then add metadata to its Markdown file:

```yaml
cover:
  src: ../../assets/projects/your-project/cover.jpg
  alt: "Describe what the real image shows."
```

Astro validates the image path and generates responsive image sizes. Without a cover, the site retains a neutral image surface. For additional narrative images, use Markdown image syntax with a relative file path and descriptive alternative text.

Optional structured results and links:

```yaml
results:
  - label: "[Verified outcome]"
    detail: "[Supporting context, source, or measurement period]"
links:
  - label: "[Destination name]"
    url: "https://example.com"
```

Replace all bracketed content and example URLs before using these fields. Results and links sections appear only when populated. If using structured results, avoid repeating them in the Markdown body.

## Contact and resume

Set `email` in `src/data/site.json` to enable the real email link. Add social entries as `{ "label": "LinkedIn", "url": "https://..." }`. Empty values do not create fake links or inactive form controls.

When the resume is ready, save the PDF as `public/resume.pdf` and set `resumeUrl` to `/resume.pdf`. Update the web resume separately in `src/content/pages/resume.md`. No placeholder PDF is supplied.

## Accessibility and responsive behavior

The starter includes semantic page landmarks, one main heading per page, labeled navigation, current-page indicators, a keyboard skip link, visible focus states, descriptive project links, and responsive grids. Navigation stays visible on narrow screens without requiring JavaScript. Missing images use neutral surfaces rather than broken image elements. Real image covers require alternative text.

## Before launch

See `docs/launch-readiness.md` for the launch audit and Vercel setup. Set `SITE_URL` to the public HTTPS origin. Vercel’s production project address is used as a fallback. Preview deployments and builds without a public address remain excluded from indexing; production pages receive canonical and social metadata. The 404 page remains excluded from indexing.

## Client-Centered Brand Refresh case study

The existing `/work/client-centered-brand-refresh/` route uses `BrandRefresh.astro` for its own editorial composition. Other projects still use `ProjectLayout.astro`; future case studies can reuse the artifact components without inheriting this page's section order. All narrative copy and metadata live in the project's Markdown `caseStudy` frontmatter.

Reusable components in `src/components/case-study/`:
- `ArtifactFrame`: neutral surface or real image, with wide, square, and portrait proportions; requires alt text for supplied images.
- `ArtifactInsight`: an artifact with native keyboard/touch-accessible expandable decision notes.
- `ProjectContinuation`: related-project and substantial next-project navigation.

Add real imagery under `src/assets/projects/client-centered-brand-refresh/`, then add entries to `caseStudy.assets` in the project Markdown. Each entry has `src` (relative to that Markdown file) and `alt`. No imagery has been invented. The AVIF/JPEG/PNG source is served directly without requiring an image-processing dependency.

| Asset key | Position / requested content |
| --- | --- |
| `hero` | Large opening project visual; a supplied composite is also suitable |
| `before` | Challenge comparison: existing institution-focused visual language |
| `after` | Challenge comparison: evolved people-centered visual language |
| `photography-1` | Photography grid, opening portrait image |
| `photography-2` | Photography grid, square image |
| `photography-3` | Photography grid, square image |
| `photography-4` | Photography grid, portrait image |
| `photography-5` | Photography grid, final image |
| `website-implementation` | Constraint section: website screenshot showing the refresh within the existing site |
| `content-hierarchy` | Content design section: screenshot accompanying the hierarchy, iconography, and photography notes |
| `governance-box-hubs` | Brand Governance section: Box Hubs screenshot |
| `governance-canva` | Brand Governance section: Canva screenshot |
| `client-stories-preview` | Application section: real Grantee Client Stories visual preview |

Include descriptive alt text for each asset. Update the decision notes only with verified details once the specific screenshot is chosen. Governance screenshots replace the former ecosystem diagram.

## Design direction for future case studies

Use Client-Centered Brand Refresh as the approved visual reference for future case studies. Reuse its components and section patterns when the content serves a similar purpose; do not force every project into the same section order or composition.

Prefer the established breadcrumbs and milestone section tracker, project metadata, intro/image pairing, heading/body alignment, neutral artifact surfaces, comparisons, accessible artifact insights, editorial impact items, vertical process steps, pull statements, related-project CTA, and full-width next-project treatment where appropriate. Preserve the shared typography, colors, spacing, responsive behavior, and accessibility conventions.

Keep project copy and asset references in the content collection. Reuse existing shared components first. When a pattern currently lives inside BrandRefresh.astro or case-study.css, extract it into a shared component only when another case study actually needs it, preserving the existing page's appearance. Adapt layouts to the new project's actual content rather than inventing sections, claims, or imagery to fit the reference.

## Grantee Client Stories case study

`/work/grantee-client-stories/` uses its own `ClientStories.astro` composition. Its copy, metadata, annotations, and asset references live in `src/content/projects/grantee-client-stories.md`. No date or metrics are assumed. The Datawrapper map is explicitly a prototype, not currently live, including its mention in My Contribution.

New reusable patterns:
- `CaseStudyHero`: breadcrumbs, flexible project metadata, and the intro/artifact pairing.
- `NarrativeFlow`: semantic numbered sequence for content layers and story anatomy.

This page also reuses `ArtifactFrame`, `ArtifactInsight`, `SectionTracker`, and `ProjectContinuation`. The architecture branching and CMS workflow use semantic HTML/CSS. Optional mobile and card-detail artifacts appear only when configured.

Put images in `src/assets/projects/grantee-client-stories/` and reference them in `caseStudy.assets` with a relative `src` and descriptive `alt`, for example:

```yaml
assets:
  hero:
    src: ../../assets/projects/grantee-client-stories/story-hub.webp
    alt: "Describe the actual story-hub screenshot here."
```

Use descriptions specific to the real image when supplying assets. The available slots are:

| Asset key | Placement |
| --- | --- |
| `hero` | Opening Story Hub screenshot beside the introduction |
| `story-page` | Content Design: primary individual-story screenshot beside five visible narrative annotations |
| `story-photo-1` | Imagery section: first portrait image |
| `story-photo-2` | Imagery section: square story image |
| `story-photo-3` | Imagery section: square story image |
| `story-photo-4` | Imagery section: second portrait image |
| `story-photo-5` | Imagery section: final story image |
| `map-prototype` | Exploration section: real Datawrapper prototype, with permanent prototype/not-live status |
| `story-card-detail` | Optional small supporting artifact beneath the Content Design principles |

The related-work link returns to Client-Centered Brand Refresh. Next-project navigation points to the existing LSC Priorities Hub route; its page has not been redesigned.

The consolidated Content Design section uses one primary artifact, five static annotations, three short principles, and a compact Story Cards callout. The former Discovery, Story Template, and Page Anatomy sections have been removed. The progress tracker follows the revised section list automatically.

### Grantee Client Stories media composition

Imagery now uses `story-photo-1` (portrait), `story-photo-2`, and `story-photo-3`, plus a wide video area. The previous fourth and fifth photo slots are no longer rendered. All surfaces remain neutral until real assets are supplied.

Image entries in `caseStudy.assets` can include `caption` and `representative: true`. The latter displays “Representative imagery” so stock models are not identified as actual clients.

To supply approved video, configure `caseStudy.video` with `src` (a public media path), `title`, and `captionsSrc` (a public WebVTT caption file). Optional fields are `captionsLanguage` (defaults to `en`), `poster` (relative image path), and `transcript` (plain text). The player uses native controls and never autoplays. Without video, its neutral surface has no fake thumbnail or play button. Supply only approved media and captions; no approvals or client identities are inferred.

### Designed artifact backgrounds

Use `var(--color-artifact-canvas)` (the conference graphic’s neutral `--color-surface`, `#eeedef`) for designed covers, collages, and mockup canvases. Preserve the original background of plain screenshots; do not recolor the underlying project work.
