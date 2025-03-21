import type { Badge, Project } from '@l2beat/config'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'

export function getBadgeLink(
  badge: Badge,
  project: Project,
): string | undefined {
  if (!badge.action) return undefined
  if (badge.action.scalingFilter) {
    const [id, value] = badge.action.scalingFilter
    return `/scaling/summary?filters=${getFilterSearchParams({
      [id]: {
        values: [value],
      },
    })}`
  }

  if (badge.action.selfScalingFilter) {
    return `/scaling/summary?filters=${getFilterSearchParams({
      [badge.action.selfScalingFilter]: {
        values: [project.name],
      },
    })}`
  }

  if (badge.action.publicDaHighlight) {
    return `/data-availability/summary?highlight=${badge.action.publicDaHighlight}`
  }

  if (badge.action.selfDaHightlight) {
    return `/data-availability/summary?tab=custom&highlight=${project.slug}`
  }
}
