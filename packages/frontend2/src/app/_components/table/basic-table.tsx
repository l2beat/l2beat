import { assert } from '@l2beat/shared-pure'
import {
  type Column,
  type Header,
  type Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table'
import { range } from 'lodash'
import { type CSSProperties } from 'react'
import React from 'react'
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
  className?: string
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
  className,
}: Props<T>) {
  if (table.getRowCount() === 0) {
    return <TableEmptyState />
  }
  const headerGroups = table.getHeaderGroups()
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1]! : headerGroups[0]!

  return (
    <Table className={className}>
      {groupedHeader && <ColGroup headers={groupedHeader.headers} />}
      <TableHeader>
        {groupedHeader && (
          <TableHeaderRow key={groupedHeader.id} className="border-none">
            {groupedHeader.headers.map((header) => {
              return (
                <React.Fragment key={header.id}>
                  <th
                    colSpan={header.colSpan}
                    className={cn(
                      'text-base text-black dark:text-white',
                      !header.isPlaceholder &&
                        !!header.column.columnDef.header &&
                        'rounded-t-lg px-6 pt-4',
                    )}
                  >
                    {!header.isPlaceholder &&
                      !!header.column.columnDef.header &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </th>
                  {!header.isPlaceholder && <ColumnFiller as="th" />}
                </React.Fragment>
              )
            })}
          </TableHeaderRow>
        )}
        <TableHeaderRow key={actualHeader.id}>
          {actualHeader.headers.map((header) => {
            const groupParams = getGroupParams(header.column)
            return (
              <React.Fragment key={`${actualHeader.id}-${header.id}`}>
                <TableHead
                  colSpan={header.colSpan}
                  className={cn(
                    groupParams && [
                      groupParams.isFirstInGroup && 'pl-6',
                      groupParams.isLastInGroup && 'pr-6',
                      !groupParams.headerTitle &&
                        groupParams.isFirstInGroup &&
                        'rounded-tl-lg',
                      !groupParams.headerTitle &&
                        groupParams.isLastInGroup &&
                        'rounded-tr-lg',

                      header.column.columnDef.meta?.headClassName,
                    ],
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
                {groupParams?.isLastInGroup && (
                  <ColumnFiller as="td" href={undefined} />
                )}
              </React.Fragment>
            )
          })}
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => {
          const rowType = getRowType(row.original)
          return (
            <TableRow key={row.id} className={getRowTypeClassNames(rowType)}>
              {row.getVisibleCells().map((cell) => {
                const { meta } = cell.column.columnDef
                const groupParams = getGroupParams(cell.column)
                const href = getHref(row.original.href, meta?.hash)
                return (
                  <React.Fragment key={`${row.id}-${cell.id}`}>
                    <TableCell
                      href={href}
                      align={meta?.align}
                      className={cn(
                        cell.column.getIsPinned() &&
                          getRowTypeClassNamesWithoutOpacity(rowType),
                        groupParams?.isFirstInGroup && 'pl-6',
                        groupParams?.isLastInGroup && 'pr-6',
                        meta?.cellClassName,
                      )}
                      style={getCommonPinningStyles(cell.column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                    {groupParams?.isLastInGroup && (
                      <ColumnFiller as="td" href={href} />
                    )}
                  </React.Fragment>
                )
              })}
            </TableRow>
          )
        })}
        {groupedHeader && <RowFiller headers={groupedHeader.headers} />}
      </TableBody>
    </Table>
  )
}

function ColGroup<T, V>(props: { headers: Header<T, V>[] }) {
  return props.headers.map((header) => {
    return (
      <React.Fragment key={header.id}>
        <colgroup
          className={cn(
            !header.isPlaceholder && 'bg-gray-100 dark:bg-zinc-800',
          )}
        >
          {range(header.colSpan).map((i) => (
            <col key={`${header.id}-${i}`} />
          ))}
        </colgroup>
        {!header.isPlaceholder && <ColumnFiller as="colgroup" />}
      </React.Fragment>
    )
  })
}

function RowFiller<T, V>(props: { headers: Header<T, V>[] }) {
  return (
    <tr>
      {props.headers.map((header) => (
        <td
          key={header.id}
          colSpan={header.colSpan}
          className={cn('h-4', !header.isPlaceholder && 'rounded-b-lg')}
        />
      ))}
    </tr>
  )
}

type ColumnFillerProps =
  | {
      as: 'th' | 'colgroup'
    }
  | {
      as: 'td'
      href: string | undefined
    }

function ColumnFiller(props: ColumnFillerProps) {
  if (props.as === 'td') {
    return (
      <td>
        <a href={props.href} className="flex h-full w-4 items-center" />
      </td>
    )
  }

  const Comp = props.as
  return <Comp className="w-4" />
}

function getGroupParams<T>(column: Column<T>) {
  if (!column.parent) return undefined

  const leafColumns = column.parent.getLeafColumns()
  const index = leafColumns.findIndex((c) => c.id === column.id)
  const isFirstInGroup = index !== undefined ? index === 0 : undefined
  const isLastInGroup = leafColumns
    ? index === leafColumns.length - 1
    : undefined
  return {
    headerTitle: column.parent.columnDef.header,
    isFirstInGroup,
    isLastInGroup,
  }
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

/*
  NOTICE: It is important that this functions return the same colors
*/
export function getRowTypeClassNames(rowType: RowType) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 hover:bg-blue-400 border-b border-b-blue-600 dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900'
    case 'unverified':
      return 'bg-red-100/70 dark:bg-red-900/70 hover:bg-red-100/90 dark:hover:bg-red-900/90'
    case 'under-review':
    case 'implementation-changed':
      return 'bg-yellow-200/10 hover:!bg-yellow-200/20'
    default:
      return 'dark:hover:bg-white/[0.1] hover:bg-black/[0.05] hover:shadow-sm'
  }
}
export function getRowTypeClassNamesWithoutOpacity(rowType: RowType) {
  switch (rowType) {
    case 'ethereum':
      return 'bg-blue-400 hover:bg-blue-400 group-hover/row:bg-blue-400 border-b border-b-blue-600 dark:bg-blue-900 dark:border-b-blue-500 dark:hover:bg-blue-900 dark:group-hover/row:bg-blue-900'
    case 'unverified':
      return 'bg-[#FDDDDD] dark:bg-[#311413] hover:bg-[#FDDDDD] group-hover/row:bg-[#FDDDDD] dark:hover:bg-[#391612] dark:group-hover/row:bg-[#391612]'
    case 'under-review':
    case 'implementation-changed':
      return 'bg-[#faf5e6] dark:bg-[#2a2418] hover:!bg-[#eee5c8] group-hover/row:!bg-[#eee5c8] dark:hover:!bg-[#3f351b] dark:group-hover/row:!bg-[#3f351b]'
    default:
      return 'bg-white dark:bg-neutral-900 group-hover/row:shadow-sm hover:bg-[#EEEEEE] group-hover/row:bg-[#EEEEEE] dark:hover:bg-[#2a292c] dark:group-hover/row:bg-[#2a292c]'
  }
}
