import { env } from '~/env'
import { ps } from '~/server/projects'
import type { Manifest } from '~/utils/Manifest'
import {
  getProjectUrl,
  PROJECT_PAGE_METADATA_FIELDS,
} from '~/utils/project/getProjectUrl'

export interface HeartbeatProject {
  id: string
  name: string
  iconUrl: string
  href: string | undefined
}

export async function getHeartbeatProjects(
  manifest: Manifest,
): Promise<HeartbeatProject[]> {
  const projects = await getBlockActivityProjects()
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    iconUrl: manifest.getUrl(`/icons/${p.slug}.png`),
    href: getProjectUrl(p),
  }))
}

export async function getHeartbeatProjectIds(): Promise<string[]> {
  const projects = await getBlockActivityProjects()
  return projects.map((p) => p.id)
}

/** Counted block by block, so the backend follows their heads on EVM chains */
async function getBlockActivityProjects() {
  const projects = await ps.getProjects({
    select: ['activityConfig'],
    optional: [...PROJECT_PAGE_METADATA_FIELDS],
    whereNot: ['archivedAt'],
  })
  return projects.filter(
    (p) =>
      p.activityConfig.type === 'block' &&
      !env.EXCLUDED_ACTIVITY_PROJECTS?.includes(p.id),
  )
}
