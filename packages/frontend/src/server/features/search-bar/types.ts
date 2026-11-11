import type { ProjectScalingCategory } from '@l2beat/config'
import type { SearchIndexProjectKind } from '~/components/search-bar/searchIndex'
import type { SearchBarEntry } from '~/components/search-bar/types'
import type { SEARCH_BAR_PROJECT_KEYS } from './utils/toSearchBarProject'

export type SearchBarProjectEntry = SearchBarEntry & {
  type: 'project'
  id: string
  iconUrl: string
  kind: SearchIndexProjectKind
  l2Category?: ProjectScalingCategory
  /** For a project with several versions, each with its own page. Rank 0 is
   *  the latest, then newest first. */
  version?: { group: string; rank: number }
}

export type SearchBarTokenEntry = SearchBarEntry & {
  type: 'token'
  id: string
  iconUrl: string
  issuer: string | null
}

/** Return type sent to frontend - excludes not needed properties to reduce payload size */
export type SearchBarProject = Pick<
  SearchBarProjectEntry,
  (typeof SEARCH_BAR_PROJECT_KEYS)[number]
>

export type SearchBarToken = SearchBarTokenEntry
