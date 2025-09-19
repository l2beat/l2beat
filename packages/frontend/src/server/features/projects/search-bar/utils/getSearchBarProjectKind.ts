import type { Project } from '@l2beat/config'
import type { SearchBarProject } from '../types'

export function getSearchBarProjectKind(
  p: Project<
    never,
    | 'scalingInfo'
    | 'isBridge'
    | 'isDaLayer'
    | 'ecosystemConfig'
    | 'zkCatalogInfo'
  >,
): SearchBarProject['kind'] {
  if (p.scalingInfo?.layer === 'layer2') return 'layer2'
  if (p.scalingInfo?.layer === 'layer3') return 'layer3'
  if (p.isBridge) return 'bridge'
  if (p.isDaLayer) return 'da'
  if (p.ecosystemConfig) return 'ecosystem'
  if (p.zkCatalogInfo) return 'zkCatalog'
  // Should never happen
  return 'da'
}
