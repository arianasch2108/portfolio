import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.'),
    summary: z.string().min(1),
    format: z.enum(['case-study', 'brief']),
    disciplines: z.array(z.string().min(1)).min(1),
    featured: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    draft: z.boolean().default(true),
    sample: z.boolean().default(false),
    role: z.string().optional(),
    client: z.string().optional(),
    context: z.string().optional(),
    year: z.string().optional(),
    tools: z.string().optional(),
    brief: z.object({
      subtitle: z.string(), context: z.string(), roles: z.array(z.string()), focus: z.string(),
      intro: z.array(z.string()), nextSlug: z.string(),
      sections: z.array(z.object({
        id: z.string(), eyebrow: z.string(), heading: z.string(), paragraphs: z.array(z.string()),
        decisions: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
        audience: z.object({ age: z.string(), traits: z.array(z.object({ title: z.string(), body: z.string() })), platform: z.string(), platformCopy: z.string(), flow: z.array(z.string()) }).optional(),
        campaignLine: z.string().optional(),
        positioning: z.object({ idea: z.string(), body: z.string(), anchors: z.array(z.object({ title: z.string(), body: z.string() })), result: z.string() }).optional(),
        copyArtifact: z.object({ headline: z.string(), product: z.string(), description: z.string(), closing: z.string(), signature: z.string(), story: z.string() }).optional(),
        artifact: z.object({
          label: z.string(), src: image().optional(), alt: z.string().min(1),
          details: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string() })).max(3).default([]),
        }).optional(),
      })),
    }).optional(),
    caseStudy: z.object({
      label: z.string(), subtitle: z.string(), timeline: z.string().optional(), scope: z.string(), intro: z.string(),
      platforms: z.string().optional(),
      artifactGroups: z.record(z.string(), z.array(z.object({ key: z.string(), label: z.string(), shape: z.enum(['wide', 'portrait', 'square']).default('wide') }))).optional(),
      myRole: z.string().optional(), tools: z.string().optional(), nextSlug: z.string().optional(), relatedText: z.string().optional(),
      relatedSlug: z.string().optional(),
      assets: z.record(z.string(), z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional(), crop: z.tuple([z.number(), z.number(), z.number().positive(), z.number().positive()]).optional(), presentation: z.enum(["laptop", "tablet"]).optional(), representative: z.boolean().optional() })),
      video: z.object({
        src: z.string().startsWith('/'), title: z.string().min(1),
        captionsSrc: z.string().startsWith('/'), captionsLanguage: z.string().default('en'),
        poster: image().optional(), transcript: z.string().optional(),
      }).optional(),
      sections: z.array(z.object({
        id: z.string(), eyebrow: z.string(), heading: z.string(), paragraphs: z.array(z.string()),
        statement: z.string().optional(),
        status: z.string().optional(),
        constraint: z.object({ label: z.string(), heading: z.string(), paragraphs: z.array(z.string()) }).optional(),
        workflow: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
        principles: z.array(z.object({ title: z.string(), label: z.string(), body: z.string() })).optional(),
        supportingArtifact: z.object({ title: z.string(), label: z.string(), body: z.string() }).optional(),
        architecture: z.object({
          hub: z.string(), story: z.string(),
          discovery: z.array(z.object({ title: z.string(), body: z.string(), detail: z.string().optional(), status: z.string().optional() })),
          destinations: z.array(z.object({ title: z.string(), body: z.string() })),
        }).optional(),
        items: z.array(z.object({ title: z.string(), label: z.string().optional(), body: z.string() })).optional(),
        lookFor: z.array(z.string()).optional(), avoid: z.array(z.string()).optional(),
        outcomes: z.array(z.string()).optional(),
      })),
    }).optional(),
    cover: z.object({ src: image(), alt: z.string().min(1) }).optional(),
    results: z.array(z.object({ label: z.string(), detail: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), url: z.url({ protocol: /^https?$/ }) })).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    title: z.string(), description: z.string(),
    homepage: z.object({
      eyebrow: z.string(), positioning: z.string(),
      positioningIsPlaceholder: z.boolean().default(true),
      portrait: z.object({ src: image(), alt: z.string().min(1) }).optional(),
      impactHeading: z.string(),
      achievements: z.array(z.object({ value: z.string(), label: z.string(), placeholder: z.boolean().default(true) })).length(3),
      caseStudyHeading: z.string(), caseStudyIntro: z.string(),
      selectedHeading: z.string(), selectedIntro: z.string(),
      resumeHeading: z.string(), resumeSupporting: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { projects, pages };
