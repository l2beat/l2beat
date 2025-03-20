import type { Badge, Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'

export function getBadgeLink(
  project: Project<never, 'scalingDa' | 'customDa'>,
  badge: Badge,
): string | undefined {
  if (badge.type === 'Other' && badge.id === 'L3HostChain') {
    return `/scaling/summary?filters=${getFilterSearchParams({
      hostChain: { values: [project.name] },
    })}`
  }

  if (badge.type === 'DA') {
    if (project.customDa) {
      return `/data-availability/summary?tab=custom&highlight=${project.slug}`
    }
    if (project.scalingDa && project.scalingDa.layer.projectId) {
      return `/data-availability/summary?highlight=${project.scalingDa.layer.projectId}`
    }
  }

  const filterName = 'filterName' in badge ? badge.filterName : undefined
  if (!filterName) return undefined

  switch (badge.type) {
    case 'RaaS':
      return `/scaling/summary?filters=${getFilterSearchParams({
        raas: { values: [filterName] },
      })}`
    case 'Stack':
      return `/scaling/summary?filters=${getFilterSearchParams({
        stack: { values: [filterName] },
      })}`
    case 'Infra':
      return `/scaling/summary?filters=${getFilterSearchParams({
        infrastructure: { values: [filterName] },
      })}`
    case 'VM':
      return `/scaling/summary?filters=${getFilterSearchParams({
        vm: { values: [filterName] },
      })}`
    case 'L3ParentChain':
      return `/scaling/summary?filters=${getFilterSearchParams({
        hostChain: { values: [filterName] },
      })}`
    case 'DA':
    case 'Other':
    case 'Fork':
      return undefined
    default:
      assertUnreachable(badge)
  }
}
