import { getCollection } from 'astro:content';

export async function getPublishedProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  const slugs = new Set<string>();
  for (const project of projects) {
    if (slugs.has(project.data.slug)) {
      throw new Error(`Duplicate project slug: ${project.data.slug}. Each published project needs a unique slug.`);
    }
    slugs.add(project.data.slug);
  }
  return projects.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}
