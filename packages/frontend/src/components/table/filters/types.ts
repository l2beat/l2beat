import type { filterIdToLabel } from './utils/labels'

export interface FilterableEntry {
  filterable: FilterableValue[] | undefined
}

export type FilterableValue = {
  id: FilterableValueId
  value: string
}

export type FilterableValueId = keyof typeof filterIdToLabel
