import { UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { get7dTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import {
  type DiscoveryUpdate,
  getDiscoveryUpdates,
} from './getDiscoveryUpdates'

const RECENT_CHANGES_WINDOW = 7 * UnixTime.DAY
/** Updates are newest-first; a 7-day window never needs more than a handful. */
const PER_PROJECT_LIMIT = 20

export interface RecentChangesProjectGroup {
  name: string
  iconUrl: string
  /** Link to the project detail page's Updates section. */
  href: string
  updates: DiscoveryUpdate[]
}

export interface RecentChangesOverview {
  count: number
  groups: RecentChangesProjectGroup[]
}

export async function getRecentChangesOverview(): Promise<RecentChangesOverview> {
  const projects = await ps.getProjects({
    optional: ['discoveryInfo', 'scalingInfo', 'interopConfig'],
    whereNot: ['archivedAt'],
  })

  const since = UnixTime.now() - RECENT_CHANGES_WINDOW

  const grouped: { projectId: string; group: RecentChangesProjectGroup }[] = []
  for (const project of projects) {
    if (!project.discoveryInfo?.hasDiscoUi) {
      continue
    }

    // Only scaling and interop projects have a detail page with an Updates
    // section to link to.
    const href = project.scalingInfo
      ? `/scaling/projects/${project.slug}#updates`
      : project.interopConfig
        ? `/interop/protocols/${project.slug}#updates`
        : undefined
    if (!href) {
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
        href,
        updates,
      },
    })
  }

  // Highest-TVS projects first; projects without TVS (e.g. interop-only
  // protocols) fall back to most recently changed.
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
