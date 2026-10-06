import type { Project } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getApprovedOngoingAnomalies } from './getApprovedOngoingAnomalies'

export type OngoingAnomalyCategory = 'layer2s' | 'data-availability'

export interface OngoingAnomalyItem {
  name: string
  slug: string
  iconUrl: string
  category: OngoingAnomalyCategory
  href: string
  durationInSeconds: number
  subtypes: TrackedTxsConfigSubtype[]
}

export interface OngoingAnomaliesOverview {
  count: number
  items: OngoingAnomalyItem[]
}

export async function getOngoingAnomaliesOverview(): Promise<OngoingAnomaliesOverview> {
  const grouped = await getApprovedOngoingAnomalies()

  const projectIds = Object.keys(grouped)
  if (projectIds.length === 0) {
    return { count: 0, items: [] }
  }

  const projects = await ps.getProjects({
    ids: projectIds.map((id) => ProjectId(id)),
    optional: ['daBridge'],
  })
  const projectsById = new Map(projects.map((p) => [p.id.toString(), p]))
  const daLayerSlugById = await getDaLayerSlugs(projects)

  const now = UnixTime.now()
  const items: OngoingAnomalyItem[] = []
  let count = 0

  for (const [projectId, anomalies] of Object.entries(grouped)) {
    count += anomalies.length
    const project = projectsById.get(projectId)
    if (!project || anomalies.length === 0) {
      continue
    }
    const earliestStart = Math.min(...anomalies.map((a) => a.start))
    const subtypes = [...new Set(anomalies.map((a) => a.subtype))]
    const location = getLivenessLocation(project, daLayerSlugById)
    if (!location) {
      continue
    }
    items.push({
      name: project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      ...location,
      durationInSeconds: now - earliestStart,
      subtypes,
    })
  }

  items.sort((a, b) => b.durationInSeconds - a.durationInSeconds)

  return { count, items }
}

// DA bridges are tracked as their own projects, but their liveness lives on
// the DA layer's page, so the link needs the layer slug.
async function getDaLayerSlugs(
  projects: Project<never, 'daBridge'>[],
): Promise<Map<string, string>> {
  const layerIds = [
    ...new Set(
      projects.flatMap((p) => (p.daBridge ? [p.daBridge.daLayer] : [])),
    ),
  ]
  if (layerIds.length === 0) {
    return new Map()
  }
  const layers = await ps.getProjects({ ids: layerIds })
  return new Map(layers.map((l) => [l.id.toString(), l.slug]))
}

function getLivenessLocation(
  project: Project<never, 'daBridge'>,
  daLayerSlugById: Map<string, string>,
): Pick<OngoingAnomalyItem, 'category' | 'href'> | undefined {
  if (!project.daBridge) {
    return {
      category: 'layer2s',
      href: `/layer2s/projects/${project.slug}#liveness`,
    }
  }
  const layerSlug = daLayerSlugById.get(project.daBridge.daLayer.toString())
  if (!layerSlug) {
    return undefined
  }
  return {
    category: 'data-availability',
    href: `/data-availability/projects/${layerSlug}/${project.slug}#da-bridge-liveness`,
  }
}
