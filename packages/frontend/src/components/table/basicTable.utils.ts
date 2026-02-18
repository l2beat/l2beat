import { assert } from '@l2beat/shared-pure'
import type { Column, HeaderGroup, Row } from '@tanstack/react-table'

export function getBasicTableHeaderSections<T>(
  headerGroups: HeaderGroup<T>[],
): {
  groupedHeader: HeaderGroup<T> | undefined
  actualHeader: HeaderGroup<T>
} {
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1] : headerGroups[0]
  assert(actualHeader, 'Actual header is required')

  return { groupedHeader, actualHeader }
}

export function applyBasicTableRowSorting<T>(
  rows: Row<T>[],
  rowSortingFn: ((a: Row<T>, b: Row<T>) => number) | undefined,
) {
  if (rowSortingFn !== undefined) {
    rows.sort((a, b) => rowSortingFn(a, b))
  }
  return rows
}

export function getBasicTableRowSpanDenominator(rowCounts: number[]): number {
  const denominator = commonDenominator(rowCounts)
  const maxRowSpan = Math.max(...rowCounts)
  assert(denominator === maxRowSpan, 'Incorrect row configuration')
  return denominator
}

export function getBasicTableAdditionalRowIndex(
  additionalRowIndex: number,
  rowSpan: number,
): number | undefined {
  const actualIndex = (additionalRowIndex + 1) / rowSpan - 1
  if (!Number.isInteger(actualIndex)) {
    return undefined
  }
  return actualIndex
}

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

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

function leastCommonMultiple(a: number, b: number): number {
  return (a * b) / greatestCommonDivisor(a, b)
}

function commonDenominator(numbers: number[]): number {
  return numbers.reduce((acc, num) => leastCommonMultiple(acc, num))
}
