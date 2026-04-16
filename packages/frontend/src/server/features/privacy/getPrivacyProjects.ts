import { ps } from '~/server/projects'
import type { PrivacyProjectConfig } from './types'

export const PRIVACY_PROJECT_SLUGS = [
  'railgun',
  'privacy-pools',
  'tornado-cash',
] as const

export async function getPrivacyProjects(): Promise<PrivacyProjectConfig[]> {
  const projects = await ps.getProjects({
    slugs: [...PRIVACY_PROJECT_SLUGS],
    select: ['display', 'privacyInfo', 'statuses'],
    optional: ['permissions', 'discoveryInfo'],
  })

  const bySlug = new Map(projects.map((project) => [project.slug, project]))

  return PRIVACY_PROJECT_SLUGS.map((slug) => {
    const project = bySlug.get(slug)
    if (!project) {
      throw new Error(`Missing privacy project config for ${slug}`)
    }
    return project
  })
}
