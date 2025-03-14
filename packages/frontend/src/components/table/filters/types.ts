import type { filterIdToLabel } from './utils/filter-id-to-label'

export interface FilterableEntry {
  filterable: FilterableValue[] | undefined
}

export type FilterableValue = {
  id: FilterableValueId
  value: string
}

export type FilterableValueId = keyof typeof filterIdToLabel
