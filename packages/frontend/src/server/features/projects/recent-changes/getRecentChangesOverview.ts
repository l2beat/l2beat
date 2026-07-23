import { UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import {
  type DiscoveryUpdate,
  getDiscoveryUpdates,
} from './getDiscoveryUpdates'

const RECENT_CHANGES_WINDOW = 7 * UnixTime.DAY
/** Updates are newest-first; a 7-day window never needs more than a handful. */
const PER_PROJECT_LIMIT = 20

export interface RecentChangesProjectGroup {
  name: string
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

  const groups: RecentChangesProjectGroup[] = []
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

    groups.push({
      name: project.name,
      href,
      updates,
    })
  }

  // Most recently changed projects first.
  groups.sort((a, b) => mostRecent(b.updates) - mostRecent(a.updates))

  const count = groups.reduce((sum, group) => sum + group.updates.length, 0)

  return { count, groups }
}

function mostRecent(updates: DiscoveryUpdate[]): number {
  return updates.reduce(
    (max, update) => Math.max(max, update.timestamp ?? 0),
    0,
  )
}
