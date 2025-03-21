import type { Badge, Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { getFilterSearchParams } from '~/components/table/filters/utils/get-filter-search-params'

export function getBadgeLink(
  badge: Badge,
  project: Project<never, 'scalingDa' | 'customDa'>,
  daLayers: Project<'daLayer'>[],
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
      const daLayer = daLayers.find(
        (layer) => layer.id === project.scalingDa?.layer.projectId,
      )
      if (!daLayer) {
        return undefined
      }
      return `/data-availability/summary?highlight=${daLayer.slug}`
    }
  }

  const filterValue = badge.filterValue
  if (!filterValue) return undefined

  switch (badge.type) {
    case 'RaaS':
      return `/scaling/summary?filters=${getFilterSearchParams({
        raas: { values: [filterValue] },
      })}`
    case 'Stack':
      return `/scaling/summary?filters=${getFilterSearchParams({
        stack: { values: [filterValue] },
      })}`
    case 'Infra':
      return `/scaling/summary?filters=${getFilterSearchParams({
        infrastructure: { values: [filterValue] },
      })}`
    case 'VM':
      return `/scaling/summary?filters=${getFilterSearchParams({
        vm: { values: [filterValue] },
      })}`
    case 'L3ParentChain':
      return `/scaling/summary?filters=${getFilterSearchParams({
        hostChain: { values: [filterValue] },
      })}`
    case 'DA':
    case 'Fork':
      return undefined
    default:
      assertUnreachable(badge)
  }
}
