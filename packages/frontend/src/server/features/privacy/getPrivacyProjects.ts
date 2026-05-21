import { ps } from '~/server/projects'
import type { PrivacyProject } from './types'

export async function getPrivacyProjects(): Promise<PrivacyProject[]> {
  return (
    await ps.getProjects({
      where: ['privacyInfo'],
      select: ['display', 'privacyInfo', 'statuses', 'tvsConfig'],
      optional: ['contracts', 'permissions', 'discoveryInfo'],
    })
  ).sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function getPrivacyProjectBySlug(
  slug: string,
): Promise<PrivacyProject | undefined> {
  return await ps.getProject({
    slug,
    where: ['privacyInfo'],
    select: ['display', 'privacyInfo', 'statuses', 'tvsConfig'],
    optional: ['contracts', 'permissions', 'discoveryInfo'],
  })
}
