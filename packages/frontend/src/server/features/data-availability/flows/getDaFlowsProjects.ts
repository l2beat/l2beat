import { INTEROP_CHAINS } from '@l2beat/config'
import { assert, type ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'

export interface DaFlowsProject {
  id: string
  name: string
  iconUrl: string
  color: string
  href: string
}

export interface DaFlowsProjects {
  daLayer: DaFlowsProject
  projects: DaFlowsProject[]
}

/**
 * Projects have no color of their own unless they are an interop chain or
 * set one for their page, so the rest take one from this list by their id.
 */
const FALLBACK_COLORS = [
  '#7C8CF8',
  '#36B5A0',
  '#E5A13B',
  '#D86AA8',
  '#5AA9E6',
  '#9B7EDE',
  '#6FBF73',
  '#E0776B',
]

export async function getDaFlowsProjects(
  daLayerId: ProjectId,
): Promise<DaFlowsProjects> {
  const [daLayer, projects] = await Promise.all([
    ps.getProject({ id: daLayerId, select: ['daLayer'], optional: ['colors'] }),
    ps.getProjects({
      select: ['daTrackingConfig', 'scalingInfo'],
      optional: ['colors'],
      whereNot: ['archivedAt'],
    }),
  ])
  assert(daLayer, `DA layer ${daLayerId} not found`)

  return {
    daLayer: {
      id: daLayer.id,
      name: daLayer.name,
      iconUrl: manifest.getUrl(`/icons/${daLayer.slug}.png`),
      color: getColor(daLayer),
      href: `/data-availability/projects/${daLayer.slug}`,
    },
    projects: projects
      .filter((p) => p.daTrackingConfig.some((c) => c.daLayer === daLayerId))
      .map((p) => ({
        id: p.id,
        name: p.shortName ?? p.name,
        iconUrl: manifest.getUrl(`/icons/${p.slug}.png`),
        color: getColor(p),
        href: `/layer2s/projects/${p.slug}`,
      })),
  }
}

function getColor(project: {
  id: string
  colors?: { primary: { light: string } }
}): string {
  const interopChain = INTEROP_CHAINS.find((c) => c.id === project.id)
  if (interopChain) return interopChain.color
  if (project.colors) return project.colors.primary.light
  return pickFallbackColor(project.id)
}

export function pickFallbackColor(id: string): string {
  let hash = 0
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2 ** 31
  }
  const color = FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
  assert(color)
  return color
}
