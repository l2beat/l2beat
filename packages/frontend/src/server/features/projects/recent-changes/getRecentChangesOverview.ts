import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { get7dTvsBreakdown } from '../../layer2s/tvs/get7dTvsBreakdown'
import {
  type DiscoveryUpdate,
  getDiscoveryUpdates,
} from './getDiscoveryUpdates'

const RECENT_CHANGES_WINDOW = 7 * UnixTime.DAY
const PER_PROJECT_LIMIT = 20

export interface RecentChangesProjectGroup {
  name: string
  iconUrl: string
  projectHref: string
  updates: DiscoveryUpdate[]
}

export interface RecentChangesOverview {
  count: number
  groups: RecentChangesProjectGroup[]
}

export async function getRecentChangesOverview(): Promise<RecentChangesOverview> {
  const projects = await ps.getProjects({
    optional: ['scalingInfo', 'interopConfig', 'privacyInfo'],
    whereNot: ['archivedAt'],
  })

  const since = UnixTime.now() - RECENT_CHANGES_WINDOW

  const grouped: { projectId: string; group: RecentChangesProjectGroup }[] = []
  for (const project of projects) {
    const projectHref = getProjectUpdatesHref(project)
    if (!projectHref) {
      continue
    }

    const updates = getDiscoveryUpdates(
      project.id.toString(),
      PER_PROJECT_LIMIT,
    ).filter((update) => update.timestamp !== null && update.timestamp >= since)

    if (updates.length === 0) {
      continue
    }

    grouped.push({
      projectId: project.id.toString(),
      group: {
        name: project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        projectHref,
        updates,
      },
    })
  }

  const tvs = await get7dTvsBreakdown({
    type: 'projects',
    projectIds: grouped.map((entry) => entry.projectId),
  })
  const groups = grouped
    .sort(
      (a, b) =>
        projectTvs(tvs.projects, b.projectId) -
          projectTvs(tvs.projects, a.projectId) ||
        mostRecent(b.group.updates) - mostRecent(a.group.updates),
    )
    .map((entry) => entry.group)

  const count = groups.reduce((sum, group) => sum + group.updates.length, 0)

  return { count, groups }
}

function getProjectUpdatesHref(
  project: Project<never, 'scalingInfo' | 'interopConfig' | 'privacyInfo'>,
): string | undefined {
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  if (project.interopConfig) {
    return `/interop/protocols/${project.slug}`
  }
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  return undefined
}

function projectTvs(
  projects: Record<string, { breakdown: { total: number } }>,
  projectId: string,
): number {
  return projects[projectId]?.breakdown.total ?? 0
}

function mostRecent(updates: DiscoveryUpdate[]): number {
  return updates.reduce(
    (max, update) => Math.max(max, update.timestamp ?? 0),
    0,
  )
}
