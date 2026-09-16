import type { Badge } from '@l2beat/config'
import { getFilterSearchParams } from '~/components/table/filters/utils/getFilterSearchParams'

export interface BadgeLinkProject {
  name: string
  slug: string
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
}

export function getBadgeLink(
  badge: Pick<Badge, 'action'>,
  project: BadgeLinkProject,
): string | undefined {
  if (!badge.action) return undefined
  if (badge.action.type === 'scalingFilter') {
    return `/layer2s/summary?filters=${getFilterSearchParams({
      [badge.action.id]: {
        values: [badge.action.value],
      },
    })}`
  }

  if (badge.action.type === 'selfScalingFilter') {
    return `/layer2s/summary?filters=${getFilterSearchParams({
      [badge.action.id]: {
        values: [project.name],
      },
    })}`
  }

  if (badge.action.type === 'publicDaHighlight') {
    return `/data-availability/summary?highlight=${badge.action.slug}`
  }

  if (badge.action.type === 'selfDaHighlight') {
    return `/layer2s/risk/data-availability?tab=${project.tab}&highlight=${project.slug}`
  }
}
