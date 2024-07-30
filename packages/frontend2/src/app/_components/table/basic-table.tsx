import {
  type Column,
  type Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table'
import { type CSSProperties } from 'react'
import { cn } from '~/utils/cn'
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

interface BasicEntry {
  slug: string
  isVerified?: boolean
  redWarning?: string | undefined
  showProjectUnderReview?: boolean
  hasImplementationChanged?: boolean
  href?: string
}

interface Props<T extends BasicEntry> {
  table: TanstackTable<T>
  onResetFilters: () => void
}

function getCommonPinningStyles<T>(
  column: Column<T>,
): CSSProperties | undefined {
  const isPinned = column.getIsPinned()
  if (!isPinned) return undefined
  const isLastPinned = column.getIsLastColumn('left')
    ? 'left'
    : column.getIsLastColumn('right')
      ? 'right'
      : undefined

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: 'sticky',
    width: column.getSize(),
    maskImage:
      isLastPinned &&
      `linear-gradient(to ${
        isLastPinned === 'left' ? 'right' : 'left'
      }, transparent 0, black 0px, black calc(100% - 10px), transparent 100%)`,
    zIndex: 1,
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
                className={cn(
                  'bg-white dark:bg-neutral-900',
                  header.column.columnDef.meta?.headClassName,
                )}
                align={header.column.columnDef.meta?.align}
                tooltip={header.column.columnDef.meta?.tooltip}
                style={getCommonPinningStyles(header.column)}
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
                    align={meta?.align}
                    className={cn(
                      getRowTypeClassNames(rowType),
                      meta?.cellClassName,
                    )}
                    style={getCommonPinningStyles(cell.column)}
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
      return 'bg-blue-400 hover:bg-blue-400 group-hover/row:bg-blue-400 border-b border-b-blue-600 dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900 dark:group-hover/row:bg-blue-900'
    case 'unverified':
      return 'bg-[#f7e4e3] dark:bg-[#311413] hover:bg-[#f5dedd] group-hover/row:bg-[#f5dedd] dark:hover:bg-[#391612] dark:group-hover/row:bg-[#391612]'
    case 'under-review':
    case 'implementation-changed':
      return 'bg-[#faf5e6] dark:bg-[#2a2418] hover:!bg-[#eee5c8] group-hover/row:!bg-[#eee5c8] dark:hover:!bg-[#3f351b] dark:group-hover/row:!bg-[#3f351b]'
    default:
      return 'bg-white dark:bg-neutral-900 group-hover/row:shadow-sm hover:bg-[#e3e3e3] group-hover/row:bg-[#e3e3e3] dark:hover:bg-[#2a292c] dark:group-hover/row:bg-[#2a292c]'
  }
}
