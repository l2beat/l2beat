import type { Badge, Project } from '@l2beat/config'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'
import { getScalingTab } from '../scaling/get-common-scaling-entry'

export function getBadgeLink(
  badge: Badge,
  project: Project<'scalingInfo'>,
): string | undefined {
  if (!badge.action) return undefined
  if (badge.action.type === 'scalingFilter') {
    return `/scaling/summary?filters=${getFilterSearchParams({
      [badge.action.id]: {
        values: [badge.action.value],
      },
    })}`
  }

  if (badge.action.type === 'selfScalingFilter') {
    return `/scaling/summary?filters=${getFilterSearchParams({
      [badge.action.id]: {
        values: [project.name],
      },
    })}`
  }

  if (badge.action.type === 'publicDaHighlight') {
    return `/data-availability/summary?highlight=${badge.action.slug}`
  }

  if (badge.action.type === 'selfDaHighlight') {
    return `/scaling/data-availability?tab=${getScalingTab(project)}&highlight=${project.slug}`
  }
}
