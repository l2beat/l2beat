import type { ProjectScalingCategory } from '@l2beat/config'
import type { SearchBarEntry } from '~/components/search-bar/types'

export type SearchBarProject = SearchBarEntry & {
  type: 'project'
  id: string
  isUpcoming: boolean
  iconUrl: string
  kind: 'layer2' | 'layer3' | 'bridge' | 'da' | 'zkCatalog' | 'ecosystem'
  scalingCategory?: ProjectScalingCategory
  filePrepared?: Fuzzysort.Prepared
}
