import { unique } from '@l2beat/shared-pure'
import type {
  Cell,
  Column,
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
  getPersistedColumnAttributes,
  getPersistedTableAttributes,
  getPrePaintHideScript,
} from './persistedColumnVisibility'
import { ValueAndChangeSortingHeader } from './sorting/ValueAndChangeSortingHeader'
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
import { applyBasicTableRowSorting } from './utils/applyBasicTableRowSorting'
import {
  getBasicTableBodyCellClassName,
  getBasicTableColumnFillerClassName,
  getBasicTableGroupedHeaderCellClassName,
  getBasicTableHeaderCellClassName,
} from './utils/classNames'
import { getCommonPinningStyles } from './utils/commonPinningStyles'
import { getBasicTableAdditionalRowIndex } from './utils/getBasicTableAdditionalRowIndex'
import { getBasicTableGroupParams } from './utils/getBasicTableGroupParams'
import { getBasicTableHeaderSections } from './utils/getBasicTableHeaderSections'
import { getBasicTableRowSpanDenominator } from './utils/getBasicTableRowSpanDenominator'
import {
  getHeaderGroupsWithHiddenColumns,
  getRenderedCells,
  getRenderedCellsWithHiddenColumns,
  getRenderedColSpan,
  getRenderedHeaders,
  getShownEdgeAttributes,
  getShownHeaders,
  isShownColumn,
  isShownHeader,
} from './utils/renderedTableColumns'
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
  /** @see Table */
  caption: string
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
  /**
   * Trims the row and header heights. For tables shown alongside other content
   * rather than as a page's main subject.
   */
  compact?: boolean
}

type BasicTableCellData = {
  isLastInGroup: boolean
  props: React.ComponentProps<typeof TableCell>
}

type BasicTableRenderedCellData<T extends BasicTableRow> = {
  cell: Cell<T, unknown>
  additionalRows: React.ReactNode[] | undefined
  /** A neighbour's colSpan covers this cell, so it is not rendered at all. */
  isSpannedOver: boolean
  colSpan: number | undefined
  meta: Cell<T, unknown>['column']['columnDef']['meta']
  rowSpan: number
} & ({ isShown: true; shownIndex: number } | { isShown: false })

export function BasicTable<T extends BasicTableRow>(props: BasicTableProps<T>) {
  if (props.table.getRowCount() === 0 && !props.isLoading) {
    return <TableEmptyState />
  }

  const { groupedHeader, actualHeader } = getBasicTableHeaderSections(
    getHeaderGroupsWithHiddenColumns(props.table),
  )

  const rows = applyBasicTableRowSorting(
    props.table.getRowModel().rows,
    props.rowSortingFn,
  )

  const persistedColumns = props.table.options.meta?.persistedColumns

  return (
    <>
      {persistedColumns && (
        <script
          dangerouslySetInnerHTML={{
            __html: getPrePaintHideScript(persistedColumns.tableId),
          }}
        />
      )}
      <Table
        caption={props.caption}
        tableWrapperClassName={props.tableWrapperClassName}
        {...getPersistedTableAttributes(props.table)}
      >
        {groupedHeader && <ColGroup headers={groupedHeader.headers} />}
        <TableHeader>
          {groupedHeader && (
            <BasicTableGroupedHeaderRow groupedHeader={groupedHeader} />
          )}
          <BasicTableActualHeaderRow
            actualHeader={actualHeader}
            compact={props.compact}
          />
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
    </>
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

  const headers = getRenderedHeaders(groupedHeader.headers)
  const lastShownIndex = headers.findLastIndex(isShownHeader)

  return (
    <TableHeaderRow>
      {headers.map((header, index) => {
        const isShown = isShownHeader(header)
        const hasHeader = !!header.column.columnDef.header
        const hasTitle = !header.isPlaceholder && hasHeader
        return (
          <React.Fragment key={header.id}>
            <th
              hidden={!isShown}
              colSpan={isShown ? getRenderedColSpan(header) : undefined}
              scope={hasTitle ? 'colgroup' : undefined}
              className={getBasicTableGroupedHeaderCellClassName({
                isPlaceholder: header.isPlaceholder,
                hasHeader,
                isPinned: header.column.getIsPinned() !== false,
              })}
              style={getCommonPinningStyles(header.column)}
            >
              {hasTitle &&
                flexRender(header.column.columnDef.header, header.getContext())}
            </th>
            {isShown && !header.isPlaceholder && index < lastShownIndex && (
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
  compact,
}: {
  actualHeader: HeaderGroup<T>
  compact: boolean | undefined
}) {
  const headers = getRenderedHeaders(actualHeader.headers)
  const shownEdgeAttributes = getShownEdgeAttributes(headers.map(isShownHeader))
  const lastShownIndex = headers.findLastIndex(isShownHeader)

  return (
    <TableHeaderRow>
      {headers.map((header, index) => {
        const isShown = isShownHeader(header)
        const groupParams = isShown
          ? getBasicTableGroupParams(header.column)
          : undefined
        return (
          <React.Fragment key={`${actualHeader.id}-${header.id}`}>
            <TableHead
              hidden={!isShown}
              colSpan={isShown ? getRenderedColSpan(header) : undefined}
              className={getBasicTableHeaderCellClassName({
                groupParams,
                isPinned: header.column.getIsPinned() !== false,
                headClassName: header.column.columnDef.meta?.headClassName,
                compact,
              })}
              align={header.column.columnDef.meta?.align}
              tooltip={header.column.columnDef.meta?.tooltip}
              style={getCommonPinningStyles(header.column)}
              {...getPersistedColumnAttributes(header.column)}
              {...shownEdgeAttributes[index]}
            >
              {header.isPlaceholder ? null : (
                <ValueAndChangeSortingHeader header={header} />
              )}
            </TableHead>
            {groupParams?.isLastInGroup && index < lastShownIndex && (
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
    <TableHeaderRow>
      <th colSpan={100} className="mx-0.5 h-0.5 rounded-full bg-divider" />
    </TableHeaderRow>
  )
}

export function BasicTableRow<T extends BasicTableRow>({
  row,
  className,
  ...props
}: BasicTableProps<T> & { row: Row<T>; className?: string }) {
  const { highlightedIds } = useHighlightedTableRowContext()
  const { cells, denominator } = prepareBasicTableRenderedCells(
    row,
    props.table,
  )

  const cellDataMap = new Map<number, BasicTableCellData>()

  const highlightId = props.getHighlightId?.(row.original) ?? row.original.slug
  const isHighlighted =
    highlightId !== undefined && highlightedIds.includes(highlightId)

  const shouldRenderSubComponentRow =
    row.getIsExpanded() && !!props.renderSubComponent
  const renderedSubComponent = shouldRenderSubComponentRow
    ? props.renderSubComponent?.({ row })
    : undefined

  for (const cellData of cells) {
    if (cellData.isSpannedOver || !cellData.isShown) {
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
        compact: props.compact,
      }),
      style: getCommonPinningStyles(cellData.cell.column),
      ...getPersistedColumnAttributes(cellData.cell.column),
    }

    cellDataMap.set(cellData.shownIndex, {
      isLastInGroup: groupParams?.isLastInGroup ?? false,
      props: cellProps,
    })
  }

  const getCellProps = (cellData: BasicTableRenderedCellData<T>) =>
    cellData.isShown
      ? cellDataMap.get(cellData.shownIndex)?.props
      : getHiddenColumnCellProps(cellData.cell.column)

  const getPrevCell = (cellData: BasicTableRenderedCellData<T>) =>
    cellData.isShown ? cellDataMap.get(cellData.shownIndex - 1) : undefined

  const mainRowCells = cells.filter((cellData) => !cellData.isSpannedOver)
  const mainRowEdgeAttributes = getShownEdgeAttributes(
    mainRowCells.map((cellData) => cellData.isShown),
  )

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
        {mainRowCells.map((cellData, position) => {
          const prevCell = getPrevCell(cellData)
          return (
            <React.Fragment key={`${row.id}-${cellData.cell.id}`}>
              {prevCell && prevCell.isLastInGroup && (
                <BasicTableColumnFiller as="td" rowSpan={cellData.rowSpan} />
              )}
              <TableCell
                rowSpan={cellData.rowSpan}
                colSpan={cellData.colSpan}
                {...getCellProps(cellData)}
                {...mainRowEdgeAttributes[position]}
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
        const additionalRowCells = cells.flatMap((cellData) => {
          const actualIndex = getBasicTableAdditionalRowIndex(
            additionalRowIndex,
            cellData.rowSpan,
          )
          const content =
            actualIndex === undefined
              ? undefined
              : cellData.additionalRows?.[actualIndex]
          return content ? [{ cellData, content }] : []
        })
        return (
          <TableRow
            key={`additional-row-${additionalRowIndex}`}
            highlightId={highlightId}
            className={getRowClassNames(row.original.backgroundColor)}
          >
            {additionalRowCells.map(({ cellData, content }) => {
              const cellProps = getCellProps(cellData)
              const prevCell = getPrevCell(cellData)
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
                    {...cellProps}
                    className={cn(cellProps?.className, 'first:pl-0')}
                  >
                    {content}
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
          <td
            colSpan={getRenderedCells(row.getVisibleCells()).length}
            className="max-w-0"
          >
            {renderedSubComponent}
          </td>
        </tr>
      )}
    </>
  )
}

function getHiddenColumnCellProps<T>(
  column: Column<T>,
): React.ComponentProps<typeof TableCell> {
  return { hidden: true, ...getPersistedColumnAttributes(column) }
}

/**
 * Additional rows are laid out for the shown cells only, so hiding a column
 * never adds or removes rows. A hidden column therefore renders just its main
 * cell, and additional rows never contain hidden cells.
 */
function prepareBasicTableRenderedCells<T extends BasicTableRow>(
  row: Row<T>,
  table: TanstackTable<T>,
): { cells: BasicTableRenderedCellData<T>[]; denominator: number } {
  let shownCount = 0
  const preparedCells = getRenderedCellsWithHiddenColumns(row, table).map(
    (cell): BasicTableRenderedCellData<T> => {
      const { meta } = cell.column.columnDef
      const context = cell.getContext()
      const isShown = isShownColumn(cell.column)
      const additionalRows = isShown
        ? meta?.additionalRows?.(context)
        : undefined
      const rowCount = (additionalRows?.length ?? 0) + 1

      return {
        ...(isShown
          ? { isShown: true, shownIndex: shownCount++ }
          : { isShown: false }),
        cell,
        additionalRows,
        isSpannedOver: !!(meta?.hideIfNull && cell.renderValue() === null),
        colSpan: meta?.colSpan ? meta.colSpan(context) : undefined,
        meta,
        rowSpan: rowCount,
      }
    },
  )

  const uniqueRowsCount = unique(
    preparedCells.filter((cell) => cell.isShown).map((cell) => cell.rowSpan),
  )
  const denominator = getBasicTableRowSpanDenominator(uniqueRowsCount)

  return {
    denominator,
    cells: preparedCells.map((cell) => ({
      ...cell,
      rowSpan: cell.isShown ? denominator / cell.rowSpan : 1,
    })),
  }
}

function ColGroup<T, V>(props: { headers: Header<T, V>[] }) {
  return getShownHeaders(props.headers).map((header, index, headers) => {
    const isLast = index === headers.length - 1
    return (
      <React.Fragment key={header.id}>
        <colgroup
          className={cn(!header.isPlaceholder && 'bg-header-secondary')}
        >
          {range(getRenderedColSpan(header)).map((i) => (
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
      {getShownHeaders(props.headers).map((header, index, headers) => {
        const isLast = index === headers.length - 1
        return (
          <React.Fragment key={header.id}>
            <td
              colSpan={getRenderedColSpan(header)}
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
}) {
  return (
    <Comp
      className={getBasicTableColumnFillerClassName()}
      rowSpan={rowSpan}
      colSpan={colSpan}
    />
  )
}
