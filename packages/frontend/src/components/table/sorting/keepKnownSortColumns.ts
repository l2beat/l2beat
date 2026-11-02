import type { SortingState } from '@tanstack/react-table'

/**
 * Drops sorts by columns the table doesn't have, which a hand-edited or
 * outdated URL can carry. Falls back to the default when nothing is left,
 * so the table never shows its rows unsorted. Returns `sorting` itself when
 * every column is known, so callers can compare by reference.
 */
export function keepKnownSortColumns(
  sorting: SortingState,
  columnIds: readonly string[],
  defaultSorting: SortingState = [],
): SortingState {
  const isKnown = (id: string) => columnIds.includes(id)
  const known = sorting.filter((sort) => isKnown(sort.id))
  if (known.length === sorting.length) return sorting
  if (known.length > 0) return known
  return defaultSorting.filter((sort) => isKnown(sort.id))
}
