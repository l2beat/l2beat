import { assert } from '@l2beat/shared-pure'
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
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
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
  getRowType,
} from './utils/rowType'

export interface BasicTableProps<T extends CommonProjectEntry> {
  table: TanstackTable<T>
  children?: React.ReactNode
  /**
   * Custom sub component render function
   */
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
  /**
   * If the sub component is a raw component (e.g. renders a tr element), false by default
   */
  rawSubComponent?: boolean
  /**
   * If the table is inside a main page card - bypass right margin by adding classes
   */
  insideMainPageCard?: boolean
  rowColoringMode?: 'default' | 'ignore-colors'
}

export function BasicTable<T extends CommonProjectEntry>(
  props: BasicTableProps<T>,
) {
  if (props.table.getRowCount() === 0) {
    return <TableEmptyState />
  }
  const headerGroups = props.table.getHeaderGroups()
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1] : headerGroups[0]
  assert(actualHeader, 'Actual header is required')

  const rows = getTableRows(props.table)
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
              {groupedHeader.headers.map((header) => {
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
                    {!header.isPlaceholder && (
                      <BasicTableColumnFiller as="th" />
                    )}
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
                {groupParams?.isLastInGroup && (
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
        {props.children ?? (
          <>
            {rows.ethereumEntry && (
              <BasicTableRow row={rows.ethereumEntry} {...props} />
            )}
            {rows.rest.map((row) => (
              <BasicTableRow row={row} key={row.id} {...props} />
            ))}
          </>
        )}
        {groupedHeader && <RowFiller headers={groupedHeader.headers} />}
      </TableBody>
    </Table>
  )
}

export function BasicTableRow<T extends CommonProjectEntry>({
  row,
  className,
  ...props
}: BasicTableProps<T> & { row: Row<T>; className?: string }) {
  const rowType = getRowType(row.original, props.rowColoringMode)
  const { highlightedSlug } = useHighlightedTableRowContext()

  return (
    <>
      <TableRow
        slug={row.original.slug}
        className={cn(
          getRowClassNames(rowType),
          row.getIsExpanded() &&
            props.renderSubComponent?.({ row }) &&
            'border-none!',
          className,
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const { meta } = cell.column.columnDef
          const groupParams = getBasicTableGroupParams(cell.column)

          if (meta?.hideIfNull && cell.renderValue() === null) {
            return null
          }

          const colSpan = meta?.colSpan
            ? meta.colSpan(cell.getContext())
            : undefined

          return (
            <React.Fragment key={`${row.id}-${cell.id}`}>
              <TableCell
                align={meta?.align}
                className={cn(
                  groupParams?.isFirstInGroup && 'pl-6',
                  groupParams?.isLastInGroup && 'pr-6!',
                  cell.column.getCanSort() && meta?.align === undefined
                    ? groupParams?.isFirstInGroup
                      ? 'pl-10'
                      : 'pl-4'
                    : undefined,
                  cell.column.getIsPinned() &&
                    getRowClassNamesWithoutOpacity(rowType),
                  cell.column.getIsPinned() &&
                    highlightedSlug === row.original.slug &&
                    'animate-row-highlight-no-opacity',
                  meta?.cellClassName,
                )}
                style={getCommonPinningStyles(cell.column)}
                colSpan={colSpan}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
              {groupParams?.isLastInGroup && <BasicTableColumnFiller as="td" />}
            </React.Fragment>
          )
        })}
      </TableRow>
      {row.getIsExpanded() &&
        props.renderSubComponent &&
        (props.rawSubComponent ? (
          props.renderSubComponent({ row })
        ) : (
          <tr className="border-b">
            {/* 2nd row is a custom 1 cell row */}
            <td colSpan={row.getVisibleCells().length}>
              {props.renderSubComponent({ row })}
            </td>
          </tr>
        ))}
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
        {!header.isPlaceholder && <BasicTableColumnFiller as="colgroup" />}
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
            header.column.getIsPinned() && getRowClassNamesWithoutOpacity(null),
          )}
          style={getCommonPinningStyles(header.column)}
        />
      ))}
    </tr>
  )
}

function BasicTableColumnFiller({
  as: Comp,
}: {
  as: 'th' | 'colgroup' | 'td'
}) {
  return <Comp className="h-full w-4 min-w-4" />
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

function getTableRows<T extends CommonProjectEntry>(table: TanstackTable<T>) {
  const rows = table.getRowModel().rows

  let ethereumEntry: Row<T> | undefined
  const rest: Row<T>[] = []

  for (const row of rows) {
    if (row.original.slug === 'ethereum') {
      ethereumEntry = row
      continue
    }
    rest.push(row)
  }

  return { ethereumEntry, rest }
}
