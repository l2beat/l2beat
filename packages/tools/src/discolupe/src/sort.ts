import type { ColumnId } from './columns'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  byColumnId: ColumnId
  direction: SortDirection
}

export function serializeSort(sort: SortConfig): string {
  return `${sort.byColumnId}:${sort.direction}`
}

export function deserializeSort(serialized: string): SortConfig {
  const [byColumnId, direction] = serialized.split(':') as [
    ColumnId,
    SortDirection,
  ]

  return { byColumnId, direction }
}

export function getSortDirection(
  column: string,
  sortBy: string,
  direction: SortDirection,
): SortDirection {
  return column === sortBy && direction === 'asc' ? 'desc' : 'asc'
}
