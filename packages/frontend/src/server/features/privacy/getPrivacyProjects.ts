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
