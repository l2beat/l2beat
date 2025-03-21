import type { Badge, Project } from '@l2beat/config'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'

export function getBadgeLink(
  badge: Badge,
  project: Project,
): string | undefined {
  if (!badge.action) return undefined
  if (badge.action.type === 'scalingFilter') {
    return `/scaling/summary?filters=${getFilterSearchParams({
      [badge.action.filterId]: {
        values: [badge.action.filterValue],
      },
    })}`
  }

  if (badge.action.type === 'selfScalingFilter') {
    return `/scaling/summary?filters=${getFilterSearchParams({
      [badge.action.filterId]: {
        values: [project.name],
      },
    })}`
  }

  if (badge.action.type === 'publicDaHighlight') {
    return `/data-availability/summary?highlight=${badge.action.slug}`
  }

  if (badge.action.type === 'selfDaHightlight') {
    return `/data-availability/summary?tab=custom&highlight=${project.slug}`
  }
}
