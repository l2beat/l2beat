import type { Badge, Project } from '@l2beat/config'
import { getFilterSearchParams } from '~/components/table/filters/utils/getFilterSearchParams'
import { getL2Tab } from '../layer2s/getCommonL2Entry'

export function getBadgeLink(
  badge: Badge,
  project: Project<'scalingInfo' | 'statuses'>,
): string | undefined {
  if (!badge.action) return undefined
  if (badge.action.type === 'scalingFilter') {
    return getSharedBadgeLink(badge)
  }

  if (badge.action.type === 'selfScalingFilter') {
    return `/layer2s/summary?filters=${getFilterSearchParams({
      [badge.action.id]: {
        values: [project.name],
      },
    })}`
  }

  if (badge.action.type === 'selfDaHighlight') {
    return `/layer2s/risk/data-availability?tab=${getL2Tab(project)}&highlight=${project.slug}`
  }
}

/** The link that is the same for every project wearing the badge, if any. */
export function getSharedBadgeLink(badge: Badge): string | undefined {
  if (badge.action?.type !== 'scalingFilter') return undefined
  return `/layer2s/summary?filters=${getFilterSearchParams({
    [badge.action.id]: {
      values: [badge.action.value],
    },
  })}`
}
