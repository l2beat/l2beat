import type { Badge } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'

export function getBadgeLink(badge: Badge): string | undefined {
  const filterName = badge.filterName
  console.log(badge)
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
      return 'data-availability/summary?highlighted=celestia'
    case 'Other':
    case 'Fork':
      return undefined
    default:
      assertUnreachable(badge.type)
  }
}
