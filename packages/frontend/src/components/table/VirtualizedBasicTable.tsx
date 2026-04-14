import type { Row } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import React, { useRef } from 'react'
import {
  BasicTableFrame,
  type BasicTableProps,
  type BasicTableRow,
} from '~/components/table/BasicTable'
import { useHighlightedTableRowContext } from '~/components/table/HighlightedTableRowContext'
import { TableCell, TableRow } from '~/components/table/Table'
import { TableEmptyState } from '~/components/table/TableEmptyState'
import { applyBasicTableRowSorting } from '~/components/table/utils/applyBasicTableRowSorting'
import {
  getBasicTableBodyCellClassName,
  getBasicTableColumnFillerClassName,
} from '~/components/table/utils/classNames'
import { getCommonPinningStyles } from '~/components/table/utils/commonPinningStyles'
import { getBasicTableGroupParams } from '~/components/table/utils/getBasicTableGroupParams'
import { getRowClassNames } from '~/components/table/utils/rowType'
import { cn } from '~/utils/cn'
import { Skeleton } from '../core/Skeleton'

export interface VirtualizedBasicTableProps<T extends BasicTableRow>
  extends Omit<BasicTableProps<T>, 'renderSubComponent'> {
  estimateSize: number | ((row: Row<T>) => number)
  maxHeight?: number | string
  overscan?: number
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

export function VirtualizedBasicTable<T extends BasicTableRow>({
  table,
  isLoading,
  skeletonCount,
  rowSortingFn,
  getHighlightId,
  tableWrapperClassName,
  estimateSize,
  maxHeight,
  overscan = 10,
  scrollContainerRef,
}: VirtualizedBasicTableProps<T>) {
  if (
    table
      .getAllLeafColumns()
      .some((column) => column.columnDef.meta?.additionalRows)
  ) {
    throw new Error(
      'VirtualizedBasicTable does not support columns with additionalRows.',
    )
  }

  const rows = applyBasicTableRowSorting(table.getRowModel().rows, rowSortingFn)
  const isEmpty = table.getRowCount() === 0 && !isLoading
  const internalScrollRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getItemKey: (index) => rows[index]?.id ?? index,
    getScrollElement: () =>
      scrollContainerRef?.current ?? internalScrollRef.current,
    estimateSize: (index) => {
      const row = rows[index]
      if (!row) {
        return typeof estimateSize === 'number' ? estimateSize : 0
      }

      return typeof estimateSize === 'function'
        ? estimateSize(row)
        : estimateSize
    },
    measureElement: (element) => element.getBoundingClientRect().height,
    overscan,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const firstVirtualRow = virtualRows[0]
  const lastVirtualRow = virtualRows[virtualRows.length - 1]
  const virtualPaddingTop = firstVirtualRow ? firstVirtualRow.start : 0
  const virtualPaddingBottom = lastVirtualRow
    ? rowVirtualizer.getTotalSize() - lastVirtualRow.end
    : 0

  if (isEmpty) {
    return <TableEmptyState />
  }

  const useExternalScroll = scrollContainerRef !== undefined

  return (
    <BasicTableFrame
      table={table}
      tableWrapperClassName={cn(
        !useExternalScroll && 'overflow-y-auto',
        tableWrapperClassName,
      )}
      tableWrapperRef={useExternalScroll ? undefined : internalScrollRef}
      tableWrapperStyle={useExternalScroll ? undefined : { maxHeight }}
    >
      {rows.length === 0 && isLoading ? (
        Array.from({ length: skeletonCount ?? 10 }, (_, i) => (
          <TableRow highlightId={undefined} key={i}>
            <TableCell colSpan={100}>
              <Skeleton className="h-6 w-full md:h-8" />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <>
          {virtualPaddingTop > 0 ? (
            <TableRow
              aria-hidden="true"
              className="border-0 hover:bg-transparent"
              highlightId={undefined}
            >
              <TableCell
                colSpan={100}
                className="h-0 border-0 p-0 first:pl-0 last:pr-0"
                style={{ height: `${virtualPaddingTop}px` }}
              />
            </TableRow>
          ) : null}

          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]

            if (!row) {
              return null
            }

            return (
              <VirtualizedBasicTableRow
                key={row.id}
                row={row}
                getHighlightId={getHighlightId}
                measureElement={rowVirtualizer.measureElement}
              />
            )
          })}

          {virtualPaddingBottom > 0 ? (
            <TableRow
              aria-hidden="true"
              className="border-0 hover:bg-transparent"
              highlightId={undefined}
            >
              <TableCell
                colSpan={100}
                className="h-0 border-0 p-0 first:pl-0 last:pr-0"
                style={{ height: `${virtualPaddingBottom}px` }}
              />
            </TableRow>
          ) : null}
        </>
      )}
    </BasicTableFrame>
  )
}

function VirtualizedBasicTableRow<T extends BasicTableRow>({
  row,
  getHighlightId,
  measureElement,
}: {
  row: Row<T>
  getHighlightId: BasicTableProps<T>['getHighlightId']
  measureElement: (element: HTMLTableRowElement | null) => void
}) {
  const { highlightedId } = useHighlightedTableRowContext()
  const cells = row.getVisibleCells().map((cell, index) => ({
    index,
    cell,
    isHidden: !!(
      cell.column.columnDef.meta?.hideIfNull && cell.renderValue() === null
    ),
    colSpan: cell.column.columnDef.meta?.colSpan
      ? cell.column.columnDef.meta.colSpan(cell.getContext())
      : undefined,
  }))
  const cellDataMap = new Map<
    number,
    {
      isLastInGroup: boolean
      props: React.ComponentProps<typeof TableCell>
    }
  >()

  const highlightId = getHighlightId?.(row.original) ?? row.original.slug
  const isHighlighted =
    highlightId !== undefined && highlightedId === highlightId
  const rowClassName = getRowClassNames(row.original.backgroundColor)

  for (const cellData of cells) {
    if (cellData.isHidden) {
      continue
    }

    const groupParams = getBasicTableGroupParams(cellData.cell.column)
    cellDataMap.set(cellData.index, {
      isLastInGroup: groupParams?.isLastInGroup ?? false,
      props: {
        align: cellData.cell.column.columnDef.meta?.align,
        className: getBasicTableBodyCellClassName({
          groupParams,
          isSortable: cellData.cell.column.getCanSort(),
          align: cellData.cell.column.columnDef.meta?.align,
          isPinned: cellData.cell.column.getIsPinned() !== false,
          rowBackgroundColor: row.original.backgroundColor,
          isHighlighted,
          cellClassName: cellData.cell.column.columnDef.meta?.cellClassName,
        }),
        style: getCommonPinningStyles(cellData.cell.column),
      },
    })
  }

  return (
    <TableRow
      ref={measureElement}
      highlightId={highlightId}
      className={rowClassName}
      data-index={row.index}
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
            {prevCell && prevCell.isLastInGroup ? (
              <td className={getBasicTableColumnFillerClassName()} />
            ) : null}
            <TableCell colSpan={cellData.colSpan} {...currentCell.props}>
              {flexRender(
                cellData.cell.column.columnDef.cell,
                cellData.cell.getContext(),
              )}
            </TableCell>
          </React.Fragment>
        )
      })}
    </TableRow>
  )
}
