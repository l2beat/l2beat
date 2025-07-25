import type { ProjectScalingCategory } from '@l2beat/config'
import type { SearchBarCategory } from './searchBarCategories'

interface SearchBarEntry {
  category: SearchBarCategory
  name: string
  tags?: string[]
  href: string
}

export type SearchBarPage = SearchBarEntry & {
  type: 'page'
}

export type SearchBarProject = SearchBarEntry & {
  type: 'project'
  id: string
  isUpcoming: boolean
  iconUrl: string
  addedAt: number
  kind: 'layer2' | 'layer3' | 'bridge' | 'da' | 'zkCatalog'
  scalingCategory?: ProjectScalingCategory
  filePrepared?: Fuzzysort.Prepared
}

export type AnySearchBarEntry = SearchBarPage | SearchBarProject
