import type { ProjectScalingCategory } from '@l2beat/config'
import type { SearchBarEntry } from '~/components/search-bar/types'
import type { SEARCH_BAR_PROJECT_KEYS } from './utils/toSearchBarProject'

export type SearchBarProjectEntry = SearchBarEntry & {
  type: 'project'
  id: string
  isUpcoming: boolean
  iconUrl: string
  kind: 'layer2' | 'layer3' | 'bridge' | 'da' | 'zkCatalog' | 'ecosystem'
  scalingCategory?: ProjectScalingCategory
  filePrepared?: Fuzzysort.Prepared
  contractAddresses?: string[]
}

/** Return type sent to frontend - excludes not needed properties to reduce payload size */
export type SearchBarProject = Pick<
  SearchBarProjectEntry,
  (typeof SEARCH_BAR_PROJECT_KEYS)[number]
>
