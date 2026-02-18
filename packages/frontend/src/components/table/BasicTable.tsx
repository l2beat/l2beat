import { unique } from '@l2beat/shared-pure'
import type {
  Cell,
  Header,
  HeaderGroup,
  Row,
  Table as TanstackTable,
} from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import range from 'lodash/range'
import React from 'react'
import { useHighlightedTableRowContext } from '~/components/table/HighlightedTableRowContext'
import { cn } from '~/utils/cn'
import { Skeleton } from '../core/Skeleton'
import {
  basicTableDataRoles,
  getBasicTableBodyCellClassName,
  getBasicTableColumnFillerClassName,
  getBasicTableGroupedHeaderCellClassName,
  getBasicTableHeaderCellClassName,
} from './basicTable.layout'
import {
  applyBasicTableRowSorting,
  getBasicTableAdditionalRowIndex,
  getBasicTableGroupParams,
  getBasicTableHeaderSections,
  getBasicTableRowSpanDenominator,
} from './basicTable.utils'
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
  isLoading?: boolean
  skeletonCount?: number
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
  getHighlightId?: (ctx: T) => string
  tableWrapperClassName?: string
}

type BasicTableCellData = {
  isLastInGroup: boolean
  props: React.ComponentProps<typeof TableCell>
}

type BasicTableVisibleCellData<T extends BasicTableRow> = {
  index: number
  cell: Cell<T, unknown>
  additionalRows: React.ReactNode[] | undefined
  isHidden: boolean
  colSpan: number | undefined
  meta: Cell<T, unknown>['column']['columnDef']['meta']
  rowSpan: number
}

export function BasicTable<T extends BasicTableRow>(props: BasicTableProps<T>) {
  if (props.table.getRowCount() === 0 && !props.isLoading) {
    return <TableEmptyState />
  }

  const { groupedHeader, actualHeader } = getBasicTableHeaderSections(
    props.table.getHeaderGroups(),
  )

  const rows = applyBasicTableRowSorting(
    props.table.getRowModel().rows,
    props.rowSortingFn,
  )

  return (
    <Table tableWrapperClassName={props.tableWrapperClassName}>
      {groupedHeader && <ColGroup headers={groupedHeader.headers} />}
      <TableHeader data-role={basicTableDataRoles.header}>
        {groupedHeader && (
          <BasicTableGroupedHeaderRow groupedHeader={groupedHeader} />
        )}
        <BasicTableActualHeaderRow actualHeader={actualHeader} />
        <BasicTableHeaderDividerRow />
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <BasicTableRow row={row} key={row.id} {...props} />
        ))}
        {rows.length === 0 &&
          props.isLoading &&
          range(props.skeletonCount ?? 10).map((i) => {
            return (
              <TableRow highlightId={undefined} key={i}>
                <TableCell colSpan={100}>
                  <Skeleton className="h-6 w-full md:h-8" />
                </TableCell>
              </TableRow>
            )
          })}
        {groupedHeader && <RowFiller headers={groupedHeader.headers} />}
      </TableBody>
    </Table>
  )
}

function BasicTableGroupedHeaderRow<T>({
  groupedHeader,
}: {
  groupedHeader: HeaderGroup<T>
}) {
  const shouldRenderGroupedHeaderRow = groupedHeader.headers.some(
    (header) => !header.isPlaceholder && !!header.column.columnDef.header,
  )
  if (!shouldRenderGroupedHeaderRow) {
    return null
  }

  return (
    <TableHeaderRow data-role={basicTableDataRoles.headerGroupedRow}>
      {groupedHeader.headers.map((header, index) => {
        const isLast = index === groupedHeader.headers.length - 1
        return (
          <React.Fragment key={header.id}>
            <th
              data-role={basicTableDataRoles.groupedHeaderCell}
              colSpan={header.colSpan}
              className={getBasicTableGroupedHeaderCellClassName({
                isPlaceholder: header.isPlaceholder,
                hasHeader: !!header.column.columnDef.header,
                isPinned: header.column.getIsPinned() !== false,
              })}
              style={getCommonPinningStyles(header.column, 'header-group')}
            >
              {!header.isPlaceholder &&
                !!header.column.columnDef.header &&
                flexRender(header.column.columnDef.header, header.getContext())}
            </th>
            {!header.isPlaceholder && !isLast && (
              <BasicTableColumnFiller as="th" />
            )}
          </React.Fragment>
        )
      })}
    </TableHeaderRow>
  )
}

function BasicTableActualHeaderRow<T>({
  actualHeader,
}: {
  actualHeader: HeaderGroup<T>
}) {
  return (
    <TableHeaderRow data-role={basicTableDataRoles.headerMainRow}>
      {actualHeader.headers.map((header, index) => {
        const isLast = index === actualHeader.headers.length - 1
        const groupParams = getBasicTableGroupParams(header.column)
        return (
          <React.Fragment key={`${actualHeader.id}-${header.id}`}>
            <TableHead
              data-role={basicTableDataRoles.headerCell}
              colSpan={header.colSpan}
              className={getBasicTableHeaderCellClassName({
                groupParams,
                isPinned: header.column.getIsPinned() !== false,
                headClassName: header.column.columnDef.meta?.headClassName,
              })}
              align={header.column.columnDef.meta?.align}
              tooltip={header.column.columnDef.meta?.tooltip}
              style={getCommonPinningStyles(header.column, 'header-main')}
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
                flexRender(header.column.columnDef.header, header.getContext())
              )}
            </TableHead>
            {groupParams?.isLastInGroup && !isLast && (
              <BasicTableColumnFiller as="th" />
            )}
          </React.Fragment>
        )
      })}
    </TableHeaderRow>
  )
}

function BasicTableHeaderDividerRow() {
  return (
    <TableHeaderRow data-role={basicTableDataRoles.headerDividerRow}>
      <th
        data-role={basicTableDataRoles.headerDividerCell}
        colSpan={100}
        className="mx-0.5 h-0.5 rounded-full bg-divider"
      />
    </TableHeaderRow>
  )
}

export function BasicTableRow<T extends BasicTableRow>({
  row,
  className,
  ...props
}: BasicTableProps<T> & { row: Row<T>; className?: string }) {
  const { highlightedId } = useHighlightedTableRowContext()
  const { cells, denominator } = prepareBasicTableVisibleCells(row)

  const cellDataMap = new Map<number, BasicTableCellData>()

  const highlightId = props.getHighlightId?.(row.original) ?? row.original.slug
  const isHighlighted =
    highlightId !== undefined && highlightedId === highlightId

  const shouldRenderSubComponentRow =
    row.getIsExpanded() && !!props.renderSubComponent
  const renderedSubComponent = shouldRenderSubComponentRow
    ? props.renderSubComponent?.({ row })
    : undefined

  for (const cellData of cells) {
    if (cellData.isHidden) {
      continue
    }

    const groupParams = getBasicTableGroupParams(cellData.cell.column)

    const cellProps: React.ComponentProps<typeof TableCell> = {
      align: cellData.meta?.align,
      className: getBasicTableBodyCellClassName({
        groupParams,
        isSortable: cellData.cell.column.getCanSort(),
        align: cellData.meta?.align,
        isPinned: cellData.cell.column.getIsPinned() !== false,
        rowBackgroundColor: row.original.backgroundColor,
        isHighlighted,
        cellClassName: cellData.meta?.cellClassName,
      }),
      style: getCommonPinningStyles(cellData.cell.column, 'body'),
    }

    cellDataMap.set(cellData.index, {
      isLastInGroup: groupParams?.isLastInGroup ?? false,
      props: cellProps,
    })
  }

  return (
    <>
      <TableRow
        highlightId={highlightId}
        className={cn(
          getRowClassNames(row.original.backgroundColor),
          shouldRenderSubComponentRow && renderedSubComponent && 'border-none!',
          className,
        )}
      >
        {cells.map((cellData) => {
          if (cellData.isHidden) {
            return null
          }

          const currentCell = cellDataMap.get(cellData.index)
          if (!currentCell) {
            return null
          }

          const prevCell = cellDataMap.get(cellData.index - 1)
          return (
            <React.Fragment key={`${row.id}-${cellData.cell.id}`}>
              {prevCell && prevCell.isLastInGroup && (
                <BasicTableColumnFiller as="td" rowSpan={cellData.rowSpan} />
              )}
              <TableCell
                rowSpan={cellData.rowSpan}
                colSpan={cellData.colSpan}
                {...currentCell.props}
              >
                {flexRender(
                  cellData.cell.column.columnDef.cell,
                  cellData.cell.getContext(),
                )}
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
            className={getRowClassNames(row.original.backgroundColor)}
          >
            {cells.map((cellData) => {
              const additionalRows = cellData.additionalRows
              if (!additionalRows) {
                return null
              }

              const actualIndex = getBasicTableAdditionalRowIndex(
                additionalRowIndex,
                cellData.rowSpan,
              )
              if (actualIndex === undefined) {
                return null
              }

              const additionalRow = additionalRows[actualIndex]
              if (!additionalRow) {
                return null
              }

              const cellProps = cellDataMap.get(cellData.index)
              const prevCell = cellDataMap.get(cellData.index - 1)
              return (
                <React.Fragment
                  key={`${cellData.cell.id}-${additionalRowIndex}`}
                >
                  {prevCell && prevCell.isLastInGroup && (
                    <BasicTableColumnFiller
                      as="td"
                      rowSpan={cellData.rowSpan}
                    />
                  )}
                  <TableCell
                    rowSpan={cellData.rowSpan}
                    {...cellProps?.props}
                    className={cn(cellProps?.props.className, 'first:pl-0')}
                  >
                    {additionalRow}
                  </TableCell>
                </React.Fragment>
              )
            })}
          </TableRow>
        )
      })}
      {shouldRenderSubComponentRow && (
        <tr className="border-divider border-b">
          {/* 2nd row is a custom 1 cell row */}
          <td colSpan={row.getVisibleCells().length}>{renderedSubComponent}</td>
        </tr>
      )}
    </>
  )
}

function prepareBasicTableVisibleCells<T extends BasicTableRow>(
  row: Row<T>,
): { cells: BasicTableVisibleCellData<T>[]; denominator: number } {
  const preparedCells = row.getVisibleCells().map((cell, index) => {
    const { meta } = cell.column.columnDef
    const context = cell.getContext()
    const additionalRows = meta?.additionalRows?.(context)
    const rowCount = (additionalRows?.length ?? 0) + 1

    return {
      index,
      cell,
      additionalRows,
      isHidden: !!(meta?.hideIfNull && cell.renderValue() === null),
      colSpan: meta?.colSpan ? meta.colSpan(context) : undefined,
      meta,
      rowSpan: rowCount,
    }
  })

  const uniqueRowsCount = unique(preparedCells.map((cell) => cell.rowSpan))
  const denominator = getBasicTableRowSpanDenominator(uniqueRowsCount)

  return {
    denominator,
    cells: preparedCells.map((cell) => ({
      ...cell,
      rowSpan: denominator / cell.rowSpan,
    })),
  }
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
              style={getCommonPinningStyles(header.column, 'footer-filler')}
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
}) {
  return (
    <Comp
      data-role={basicTableDataRoles.columnFiller}
      className={getBasicTableColumnFillerClassName()}
      rowSpan={rowSpan}
      colSpan={colSpan}
    />
  )
}
