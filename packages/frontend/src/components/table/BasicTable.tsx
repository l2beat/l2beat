import { assert, unique } from '@l2beat/shared-pure'
import type {
  Column,
  Header,
  Row,
  Table as TanstackTable,
} from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import range from 'lodash/range'
import React from 'react'
import { useHighlightedTableRowContext } from '~/components/table/HighlightedTableRowContext'
import { cn } from '~/utils/cn'
import { SortingArrows } from './sorting/SortingArrows'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from './Table'
import { TableEmptyState } from './TableEmptyState'
import { getCommonPinningStyles } from './utils/commonPinningStyles'
import {
  getRowClassNames,
  getRowClassNamesWithoutOpacity,
  type RowBackgroundColor,
} from './utils/rowType'

export type BasicTableRow = {
  slug?: string
  backgroundColor?: RowBackgroundColor
}

export interface BasicTableProps<T extends BasicTableRow> {
  table: TanstackTable<T>
  /**
   * Custom row sorting function
   * It is used after tanstack sorting is applied
   * For example, it allows to keep Ethereum at the top in the Activity table
   */
  rowSortingFn?: (a: Row<T>, b: Row<T>) => number
  /**
   * Custom sub component render function
   */
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
  /**
   * If the table is inside a main page card - bypass right margin by adding classes
   */
  insideMainPageCard?: boolean
  getHighlightId?: (ctx: T) => string
}

export function BasicTable<T extends BasicTableRow>(props: BasicTableProps<T>) {
  if (props.table.getRowCount() === 0) {
    return <TableEmptyState />
  }
  const headerGroups = props.table.getHeaderGroups()
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1] : headerGroups[0]
  assert(actualHeader, 'Actual header is required')

  const rows = props.table.getRowModel().rows
  const rowSortingFn = props.rowSortingFn
  if (rowSortingFn !== undefined) {
    rows.sort((a, b) => rowSortingFn(a, b))
  }

  return (
    <Table>
      {groupedHeader && <ColGroup headers={groupedHeader.headers} />}
      <TableHeader>
        {groupedHeader &&
          groupedHeader.headers.some(
            (header) =>
              !header.isPlaceholder && !!header.column.columnDef.header,
          ) && (
            <TableHeaderRow>
              {groupedHeader.headers.map((header, index) => {
                const isLast = index === groupedHeader.headers.length - 1
                return (
                  <React.Fragment key={header.id}>
                    <th
                      colSpan={header.colSpan}
                      className={cn(
                        'font-medium text-primary tracking-[-0.13px]',
                        !header.isPlaceholder &&
                          !!header.column.columnDef.header &&
                          'rounded-t-lg px-6 pt-4',
                        header.column.getIsPinned() &&
                          getRowClassNamesWithoutOpacity(null),
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
                    {!header.isPlaceholder && !isLast && (
                      <BasicTableColumnFiller as="th" />
                    )}
                  </React.Fragment>
                )
              })}
            </TableHeaderRow>
          )}
        <TableHeaderRow>
          {actualHeader.headers.map((header, index) => {
            const isLast = index === actualHeader.headers.length - 1
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
                      getRowClassNamesWithoutOpacity(null),
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
                {groupParams?.isLastInGroup && !isLast && (
                  <BasicTableColumnFiller as="th" />
                )}
              </React.Fragment>
            )
          })}
        </TableHeaderRow>
        <TableHeaderRow>
          <th colSpan={100} className="mx-0.5 h-0.5 rounded-full bg-divider" />
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <BasicTableRow row={row} key={row.id} {...props} />
        ))}
        {groupedHeader && <RowFiller headers={groupedHeader.headers} />}
      </TableBody>
    </Table>
  )
}

export function BasicTableRow<T extends BasicTableRow>({
  row,
  className,
  ...props
}: BasicTableProps<T> & { row: Row<T>; className?: string }) {
  const { highlightedId } = useHighlightedTableRowContext()

  const uniqueRowsCount = unique(
    row
      .getVisibleCells()
      .map(
        (cell) =>
          (cell.column.columnDef.meta?.additionalRows?.(cell.getContext())
            .length ?? 0) + 1,
      ),
  )

  const denominator = commonDenominator(uniqueRowsCount)
  const maxRowSpan = Math.max(...uniqueRowsCount)
  assert(denominator === maxRowSpan, 'Incorrect row configuration')

  const cellDataMap = new Map<
    number,
    {
      isLastInGroup: boolean
      props: React.ComponentProps<typeof TableCell>
    }
  >()

  const highlightId = props.getHighlightId?.(row.original) ?? row.original.slug

  const isHighlighted =
    highlightId !== undefined && highlightedId === highlightId

  return (
    <>
      <TableRow
        highlightId={highlightId}
        className={cn(
          getRowClassNames(row.original.backgroundColor),
          row.getIsExpanded() &&
            props.renderSubComponent?.({ row }) &&
            'border-none!',
          className,
        )}
      >
        {row.getVisibleCells().map((cell, index) => {
          const { meta } = cell.column.columnDef
          const groupParams = getBasicTableGroupParams(cell.column)

          if (meta?.hideIfNull && cell.renderValue() === null) {
            return null
          }

          const colSpan = meta?.colSpan
            ? meta.colSpan(cell.getContext())
            : undefined

          const rowSpan =
            denominator /
            ((cell.column.columnDef.meta?.additionalRows?.(cell.getContext())
              ?.length ?? 0) +
              1)

          const cellProps: React.ComponentProps<typeof TableCell> = {
            align: meta?.align,
            className: cn(
              groupParams?.isFirstInGroup && 'pl-6!',
              groupParams?.isLastInGroup && 'pr-6!',
              cell.column.getCanSort() && meta?.align === undefined
                ? groupParams?.isFirstInGroup
                  ? 'pl-10'
                  : 'pl-4'
                : undefined,
              cell.column.getIsPinned() &&
                getRowClassNamesWithoutOpacity(row.original.backgroundColor),
              cell.column.getIsPinned() &&
                isHighlighted &&
                'animate-row-highlight-no-opacity',
              meta?.cellClassName,
            ),
            style: getCommonPinningStyles(cell.column),
          }

          cellDataMap.set(index, {
            isLastInGroup: groupParams?.isLastInGroup ?? false,
            props: cellProps,
          })

          const prevCell = cellDataMap.get(index - 1)
          return (
            <React.Fragment key={`${row.id}-${cell.id}`}>
              {prevCell && prevCell.isLastInGroup && (
                <BasicTableColumnFiller as="td" rowSpan={rowSpan} />
              )}
              <TableCell rowSpan={rowSpan} colSpan={colSpan} {...cellProps}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            </React.Fragment>
          )
        })}
      </TableRow>
      {range(denominator - 1).map((additionalRowIndex) => {
        return (
          <TableRow
            key={`additional-row-${additionalRowIndex}`}
            highlightId={highlightId}
          >
            {row.getVisibleCells().map((cell, index) => {
              const additionalRows =
                cell.column.columnDef.meta?.additionalRows?.(cell.getContext())
              if (!additionalRows) {
                return null
              }

              const rowSpan = denominator / (additionalRows.length + 1)

              const actualIndex = (additionalRowIndex + 1) / rowSpan - 1
              if (!Number.isInteger(actualIndex)) {
                return null
              }

              const additionalRow = additionalRows[actualIndex]
              if (!additionalRow) {
                return null
              }

              const cellData = cellDataMap.get(index)
              const prevCell = cellDataMap.get(index - 1)
              return (
                <React.Fragment key={`${cell.id}-${additionalRowIndex}`}>
                  {prevCell && prevCell.isLastInGroup && (
                    <BasicTableColumnFiller as="td" rowSpan={rowSpan} />
                  )}
                  <TableCell rowSpan={rowSpan} {...cellData?.props}>
                    {additionalRow}
                  </TableCell>
                </React.Fragment>
              )
            })}
          </TableRow>
        )
      })}
      {row.getIsExpanded() && props.renderSubComponent && (
        <tr className="border-divider border-b">
          {/* 2nd row is a custom 1 cell row */}
          <td colSpan={row.getVisibleCells().length}>
            {props.renderSubComponent({ row })}
          </td>
        </tr>
      )}
    </>
  )
}

function ColGroup<T, V>(props: { headers: Header<T, V>[] }) {
  return props.headers.map((header, index) => {
    const isLast = index === props.headers.length - 1
    return (
      <React.Fragment key={header.id}>
        <colgroup
          className={cn(!header.isPlaceholder && 'bg-header-secondary')}
        >
          {range(header.colSpan).map((i) => (
            <col key={`${header.id}-${i}`} />
          ))}
        </colgroup>
        {!header.isPlaceholder && !isLast && (
          <BasicTableColumnFiller as="colgroup" />
        )}
      </React.Fragment>
    )
  })
}

function RowFiller<T, V>(props: { headers: Header<T, V>[] }) {
  return (
    <tr>
      {props.headers.map((header, index) => {
        const isLast = index === props.headers.length - 1
        return (
          <React.Fragment key={header.id}>
            <td
              colSpan={header.colSpan}
              className={cn(
                'h-4',
                !header.isPlaceholder && 'rounded-b-lg',
                header.column.getIsPinned() &&
                  getRowClassNamesWithoutOpacity(null),
              )}
              style={getCommonPinningStyles(header.column)}
            />
            {!header.isPlaceholder && !isLast && (
              <BasicTableColumnFiller as="td" />
            )}
          </React.Fragment>
        )
      })}
    </tr>
  )
}

function BasicTableColumnFiller({
  as: Comp,
  rowSpan,
  colSpan,
}: {
  as: 'th' | 'colgroup' | 'td'
  rowSpan?: number
  colSpan?: number
  className?: string
}) {
  return (
    <Comp className="h-full w-4 min-w-4" rowSpan={rowSpan} colSpan={colSpan} />
  )
}

export function getBasicTableGroupParams<T>(column: Column<T>) {
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

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

function leastCommonMultiple(a: number, b: number): number {
  return (a * b) / greatestCommonDivisor(a, b)
}

function commonDenominator(numbers: number[]): number {
  return numbers.reduce((acc, num) => leastCommonMultiple(acc, num))
}
