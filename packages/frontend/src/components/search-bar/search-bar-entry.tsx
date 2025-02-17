import type { SearchBarCategory } from './search-bar-categories'

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
  tvs?: number
  filePrepared?: Fuzzysort.Prepared
}

export type AnySearchBarEntry = SearchBarPage | SearchBarProject
