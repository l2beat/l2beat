import type { Badge, Project } from '@l2beat/config'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'

export function getBadgeLink(
  badge: Badge,
  project: Project,
): string | undefined {
  if (!badge.action) return undefined

  if ('scalingFilter' in badge.action && badge.action.scalingFilter) {
    const [id, value] = badge.action.scalingFilter
    return `/scaling/summary?filters=${getFilterSearchParams({
      [id]: {
        values: [value],
      },
    })}`
  }

  if ('selfScalingFilter' in badge.action && badge.action.selfScalingFilter) {
    return `/scaling/summary?filters=${getFilterSearchParams({
      [badge.action.selfScalingFilter]: {
        values: [project.name],
      },
    })}`
  }

  if ('publicDaHighlight' in badge.action && badge.action.publicDaHighlight) {
    return `/data-availability/summary?highlight=${badge.action.publicDaHighlight}`
  }

  if ('selfDaHightlight' in badge.action && badge.action.selfDaHightlight) {
    return `/data-availability/summary?tab=custom&highlight=${project.slug}`
  }
}
