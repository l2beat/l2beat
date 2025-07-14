import { assert } from '@l2beat/shared-pure'
import type {
  Column,
  Header,
  Row,
  Table as TanstackTable,
} from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import range from 'lodash/range'
import type { CSSProperties } from 'react'
import React from 'react'
import { getBasicTableGroupParams } from '~/components/table/BasicTable'
import { useHighlightedTableRowContext } from '~/components/table/HighlightedTableRowContext'
import { SortingArrows } from '~/components/table/sorting/SortingArrows'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import { TableEmptyState } from '~/components/table/TableEmptyState'
import { cn } from '~/utils/cn'

interface BasicEntry {
  slug: string
  isVerified?: boolean
  redWarning?: string | undefined
  href?: string
  childrenRows?: React.ReactNode[]
}

interface Props<T> {
  table: TanstackTable<T>
  className?: string
  renderSpanFill?: (props: { row: Row<T> }) => React.ReactElement | null
  renderInlineSpanFill?: (props: { row: Row<T> }) => React.ReactElement | null
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

export function BasicDaTable<T extends BasicEntry>({
  table,
  className,
  renderSpanFill,
  renderInlineSpanFill,
}: Props<T>) {
  if (table.getRowCount() === 0) {
    return <TableEmptyState />
  }
  const headerGroups = table.getHeaderGroups()
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1] : headerGroups[0]
  assert(actualHeader, 'Actual header is required')

  const columnLength =
    actualHeader.headers.length +
    (groupedHeader
      ? groupedHeader.headers.filter((h) => !h.isPlaceholder).length
      : 0)

  return (
    <Table className={className}>
      {groupedHeader && <ColGroup headers={groupedHeader.headers} />}
      <TableHeader>
        {groupedHeader &&
          groupedHeader.headers.some(
            (header) =>
              !header.isPlaceholder && !!header.column.columnDef.header,
          ) && (
            <TableHeaderRow>
              {groupedHeader.headers.map((header) => {
                return (
                  <React.Fragment key={header.id}>
                    <th
                      colSpan={header.colSpan}
                      className={cn(
                        'font-medium text-primary tracking-[-0.13px]',
                        header.column.getIsPinned() &&
                          getRowTypeClassNamesWithoutOpacity(),

                        !header.isPlaceholder &&
                          !!header.column.columnDef.header &&
                          'rounded-t-lg px-6 pt-4',
                      )}
                      style={getCommonPinningStyles(header.column)}
                    >
                      {!header.isPlaceholder &&
                        !!header.column.columnDef.header &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </th>
                  </React.Fragment>
                )
              })}
            </TableHeaderRow>
          )}
        <TableHeaderRow>
          {actualHeader.headers.map((header) => {
            const groupParams = getBasicTableGroupParams(header.column)
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
                    ],
                    header.column.getIsPinned() &&
                      getRowTypeClassNamesWithoutOpacity(),
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
              </React.Fragment>
            )
          })}
        </TableHeaderRow>
        <TableHeaderRow>
          <th
            colSpan={columnLength}
            className="mx-0.5 h-0.5 rounded-full bg-surface-tertiary"
          />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <BasicDaTableRow
            key={row.id}
            row={row}
            renderSpanFill={renderSpanFill}
            renderInlineSpanFill={renderInlineSpanFill}
          />
        ))}
        {groupedHeader && <RowFiller headers={groupedHeader.headers} />}
      </TableBody>
    </Table>
  )
}

function BasicDaTableRow<T extends BasicEntry>({
  row,
  renderSpanFill,
  renderInlineSpanFill,
}: {
  row: Row<T>
  renderSpanFill?: (props: { row: Row<T> }) => React.ReactElement | null
  renderInlineSpanFill?: (props: { row: Row<T> }) => React.ReactElement | null
}) {
  const { highlightedSlug } = useHighlightedTableRowContext()

  return (
    <>
      <TableRow
        slug={row.original.slug}
        className={cn(
          getRowTypeClassNames({
            isEthereum: row.original.slug === 'ethereum',
          }),
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const { meta } = cell.column.columnDef
          const groupParams = getBasicTableGroupParams(cell.column)

          const rowSpan = meta?.rowSpan
            ? meta.rowSpan(cell.getContext())
            : undefined

          const isVirtual = cell.column.columnDef.meta?.virtual

          if (isVirtual) {
            return null
          }

          return (
            <TableCell
              key={`${row.id}-${cell.id}`}
              align={meta?.align}
              className={cn(
                cell.column.getIsPinned() &&
                  getRowTypeClassNamesWithoutOpacity({
                    isEthereum: row.original.slug === 'ethereum',
                  }),
                cell.column.getIsPinned() &&
                  highlightedSlug === row.original.slug &&
                  'animate-row-highlight-no-opacity',
                groupParams?.isFirstInGroup && 'pl-6',
                groupParams?.isLastInGroup && 'pr-6!',
                cell.column.getCanSort() && meta?.align === undefined
                  ? groupParams?.isFirstInGroup
                    ? 'pl-10'
                    : 'pl-4'
                  : undefined,

                meta?.cellClassName,
              )}
              style={getCommonPinningStyles(cell.column)}
              rowSpan={rowSpan}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          )
        })}
        {renderInlineSpanFill?.({ row })}
      </TableRow>
      {renderSpanFill?.({ row })}
    </>
  )
}

function ColGroup<T, V>(props: { headers: Header<T, V>[] }) {
  return props.headers.map((header) => {
    return (
      <React.Fragment key={header.id}>
        <colgroup
          className={cn(!header.isPlaceholder && 'bg-header-secondary')}
        >
          {range(header.colSpan).map((i) => (
            <col key={`${header.id}-${i}`} />
          ))}
        </colgroup>
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
          className={cn(
            'h-4',
            !header.isPlaceholder && 'rounded-b-lg',
            header.column.getIsPinned() && getRowTypeClassNamesWithoutOpacity(),
          )}
          style={getCommonPinningStyles(header.column)}
        />
      ))}
    </tr>
  )
}

export function getRowTypeClassNames({ isEthereum }: { isEthereum?: boolean }) {
  return cn(
    'hover:shadow-none',
    isEthereum && 'bg-blue-500/35 dark:bg-blue-700/25',
  )
}

function getRowTypeClassNamesWithoutOpacity({
  isEthereum,
}: {
  isEthereum?: boolean
} = {}) {
  return cn('bg-surface-primary', isEthereum && 'bg-blue-400 dark:bg-blue-900')
}
