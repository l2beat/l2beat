import {
  type Table as TanstackTable,
  flexRender,
  type Column,
} from '@tanstack/react-table'
import { SortingArrows } from './sorting/sorting-arrows'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from './table'
import { TableEmptyState } from './table-empty-state'
import { type CSSProperties } from 'react'

interface BasicEntry {
  href?: string
  slug: string
  isVerified: boolean
  redWarning: string | undefined
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
}

interface Props<T extends BasicEntry> {
  table: TanstackTable<T>
  onResetFilters: () => void
}

function getCommonPinningStyles<T>(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    background: isLastLeftPinnedColumn
      ? 'linear-gradient(to left, rgb(16, 18, 21, 0), rgb(16, 18, 21, 1) 8px)'
      : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

export function BasicTable<T extends BasicEntry>({
  table,
  onResetFilters,
}: Props<T>) {
  if (table.getRowCount() === 0) {
    return <TableEmptyState onResetFilters={onResetFilters} />
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableHeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={header.column.columnDef.meta?.headClassName}
                tooltip={header.column.columnDef.meta?.tooltip}
                style={{ ...getCommonPinningStyles(header.column) }}
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <SortingArrows
                    direction={header.column.getIsSorted()}
                    nextDirection={header.column.getNextSortingOrder()}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </SortingArrows>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </TableHead>
            ))}
          </TableHeaderRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => {
          const rowType = getRowType(row.original)
          return (
            <TableRow key={row.id} className={getRowTypeClassNames(rowType)}>
              {row.getVisibleCells().map((cell) => {
                const { meta } = cell.column.columnDef
                return (
                  <TableCell
                    key={cell.id}
                    href={getHref(row.original.href, meta?.hash)}
                    className={meta?.cellClassName}
                    style={{ ...getCommonPinningStyles(cell.column) }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function getHref(href: string | undefined, hash: string | undefined) {
  if (!href) {
    return undefined
  }

  if (!hash) {
    return href
  }

  return `${href}#${hash}`
}

type RowType = ReturnType<typeof getRowType>
function getRowType(entry: BasicEntry) {
  if (entry.slug === 'ethereum') {
    return 'ethereum'
  }
  if (entry.isVerified === false || entry.redWarning) {
    return 'unverified'
  }
  if (entry.showProjectUnderReview) {
    return 'under-review'
  }
  if (entry.hasImplementationChanged) {
    return 'implementation-changed'
  }
}

export function getRowTypeClassNames(rowType: RowType) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 hover:bg-blue-400 border-b border-b-blue-600 dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900'
    case 'unverified':
      return 'bg-red-100/70 dark:bg-red-900/70 hover:bg-red-100/90 dark:hover:bg-red-900/90'
    case 'under-review':
    case 'implementation-changed':
      return 'bg-yellow-200/10 hover:!bg-yellow-200/20'
  }
}
