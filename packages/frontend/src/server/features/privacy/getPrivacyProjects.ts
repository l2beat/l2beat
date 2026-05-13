import { ps } from '~/server/projects'
import type { PrivacyProjectConfig } from './types'

export async function getPrivacyProjects(): Promise<PrivacyProjectConfig[]> {
  return (
    await ps.getProjects({
      where: ['privacyInfo'],
      select: ['display', 'privacyInfo', 'statuses'],
      optional: ['contracts', 'permissions', 'discoveryInfo'],
    })
  ).sort((a, b) => a.slug.localeCompare(b.slug))
}
