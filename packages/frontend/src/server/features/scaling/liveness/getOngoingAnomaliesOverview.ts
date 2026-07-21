import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getApprovedOngoingAnomalies } from './getApprovedOngoingAnomalies'

export interface OngoingAnomalyItem {
  name: string
  slug: string
  iconUrl: string
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
  })
  const projectsById = new Map(projects.map((p) => [p.id.toString(), p]))

  const now = UnixTime.now()
  const items: OngoingAnomalyItem[] = []
  let count = 0

  for (const [projectId, anomalies] of Object.entries(grouped)) {
    count += anomalies.length
    const project = projectsById.get(projectId)
    if (!project || anomalies.length === 0) {
      continue
    }
    // Longest-running anomaly represents the project in the compact list.
    const earliestStart = Math.min(...anomalies.map((a) => a.start))
    const subtypes = [...new Set(anomalies.map((a) => a.subtype))]
    items.push({
      name: project.name,
      slug: project.slug,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      durationInSeconds: now - earliestStart,
      subtypes,
    })
  }

  items.sort((a, b) => b.durationInSeconds - a.durationInSeconds)

  return { count, items }
}
