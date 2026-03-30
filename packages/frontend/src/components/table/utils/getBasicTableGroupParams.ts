import type { Column } from '@tanstack/react-table'

export function getBasicTableGroupParams<T>(column: Column<T>) {
  if (!column.parent) return undefined

  const leafColumns = column.parent
    .getLeafColumns()
    .filter((c) => c.getIsVisible())
  const index = leafColumns.findIndex((c) => c.id === column.id)
  return {
    headerTitle: column.parent.columnDef.header,
    isFirstInGroup: index === 0,
    isLastInGroup: index === leafColumns.length - 1,
  }
}
