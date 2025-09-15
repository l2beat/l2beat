import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import type { SearchBarCategory } from './searchBarCategories'
import type { SearchBarPage } from './searchBarPages'

export interface SearchBarEntry {
  category: SearchBarCategory
  name: string
  tags?: string[]
  href: string
}
export type AnySearchBarEntry = SearchBarPage | SearchBarProject
