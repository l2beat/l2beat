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
import { createPortal } from 'react-dom'
import { useHighlightedTableRowContext } from '~/components/table/HighlightedTableRowContext'
import { cn } from '~/utils/cn'
import { Skeleton } from '../core/Skeleton'
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
  stickyHeader?: boolean
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

type StickyHeaderState = {
  active: boolean
  headerCellWidths: number[]
  scrollWrapperLeft: number
  scrollWrapperWidth: number
  tableWidth: number
  top: number
}

const DEFAULT_STICKY_HEADER_STATE: StickyHeaderState = {
  active: false,
  headerCellWidths: [],
  scrollWrapperLeft: 0,
  scrollWrapperWidth: 0,
  tableWidth: 0,
  top: 0,
}

export function BasicTable<T extends BasicTableRow>(props: BasicTableProps<T>) {
  const isEmpty = props.table.getRowCount() === 0 && !props.isLoading
  const stickyHeader = props.stickyHeader ?? true
  const scrollWrapperRef = React.useRef<HTMLDivElement>(null)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const stickyHeaderContentRef = React.useRef<HTMLDivElement>(null)
  const lastStickyHeaderScrollLeftRef = React.useRef<number | null>(null)
  const [stickyHeaderState, setStickyHeaderState] = React.useState(
    DEFAULT_STICKY_HEADER_STATE,
  )

  const { groupedHeader, actualHeader } = getBasicTableHeaderSections(
    props.table.getHeaderGroups(),
  )

  const rows = applyBasicTableRowSorting(
    props.table.getRowModel().rows,
    props.rowSortingFn,
  )

  const updateStickyHeaderTransform = React.useCallback(() => {
    const scrollWrapper = scrollWrapperRef.current
    const stickyHeaderContent = stickyHeaderContentRef.current

    if (!scrollWrapper || !stickyHeaderContent) {
      return
    }

    const scrollLeft = scrollWrapper.scrollLeft
    if (lastStickyHeaderScrollLeftRef.current === scrollLeft) {
      return
    }

    lastStickyHeaderScrollLeftRef.current = scrollLeft
    stickyHeaderContent.style.setProperty(
      '--table-sticky-scroll-x',
      `${scrollLeft}px`,
    )
    stickyHeaderContent.style.transform = `translate3d(${-scrollLeft}px, 0, 0)`
  }, [])

  const syncStickyHeaderState = React.useCallback(() => {
    if (!stickyHeader) {
      setStickyHeaderState(DEFAULT_STICKY_HEADER_STATE)
      return
    }

    const scrollWrapper = scrollWrapperRef.current
    const table = tableRef.current
    const tableHead = table?.tHead

    if (!scrollWrapper || !table || !tableHead) {
      setStickyHeaderState(DEFAULT_STICKY_HEADER_STATE)
      return
    }

    const actualHeaderRowIndex = Math.max(tableHead.rows.length - 2, 0)
    const actualHeaderRow = tableHead.rows.item(actualHeaderRowIndex)
    const headerCellWidths = actualHeaderRow
      ? Array.from(actualHeaderRow.cells).map(
          (cell) => cell.getBoundingClientRect().width,
        )
      : []

    const scrollWrapperRect = scrollWrapper.getBoundingClientRect()
    const tableRect = table.getBoundingClientRect()
    const tableHeadRect = tableHead.getBoundingClientRect()
    const stickyTopCssValue = getComputedStyle(scrollWrapper)
      .getPropertyValue('--table-sticky-top')
      .trim()
    const parsedStickyTop = Number.parseFloat(stickyTopCssValue)
    const stickyTop = Number.isNaN(parsedStickyTop) ? 0 : parsedStickyTop

    const nextState: StickyHeaderState = {
      active:
        headerCellWidths.length > 0 &&
        tableRect.top <= stickyTop &&
        tableRect.bottom > stickyTop + tableHeadRect.height,
      headerCellWidths,
      scrollWrapperLeft: scrollWrapperRect.left,
      scrollWrapperWidth: scrollWrapper.clientWidth,
      tableWidth: tableRect.width,
      top: stickyTop,
    }

    setStickyHeaderState((previousState) =>
      areStickyHeaderStatesEqual(previousState, nextState)
        ? previousState
        : nextState,
    )
  }, [stickyHeader])

  React.useEffect(() => {
    if (!stickyHeader) {
      setStickyHeaderState(DEFAULT_STICKY_HEADER_STATE)
      return
    }

    let stateAnimationFrame = 0
    const scheduleSync = () => {
      cancelAnimationFrame(stateAnimationFrame)
      stateAnimationFrame = window.requestAnimationFrame(syncStickyHeaderState)
    }

    scheduleSync()

    const scrollWrapper = scrollWrapperRef.current
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    const resizeObserver = new ResizeObserver(scheduleSync)
    if (scrollWrapper) {
      resizeObserver.observe(scrollWrapper)
    }
    if (tableRef.current) {
      resizeObserver.observe(tableRef.current)
    }

    return () => {
      cancelAnimationFrame(stateAnimationFrame)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
      resizeObserver.disconnect()
    }
  }, [stickyHeader, syncStickyHeaderState])

  React.useEffect(() => {
    syncStickyHeaderState()
  }, [syncStickyHeaderState])

  React.useEffect(() => {
    if (!stickyHeader) {
      lastStickyHeaderScrollLeftRef.current = null
      return
    }

    const scrollWrapper = scrollWrapperRef.current
    if (!scrollWrapper) {
      return
    }

    let transformAnimationFrame = 0
    const scheduleTransformUpdate = () => {
      if (transformAnimationFrame !== 0) {
        return
      }

      transformAnimationFrame = window.requestAnimationFrame(() => {
        transformAnimationFrame = 0
        updateStickyHeaderTransform()
      })
    }

    scheduleTransformUpdate()
    scrollWrapper.addEventListener('scroll', scheduleTransformUpdate, {
      passive: true,
    })

    return () => {
      if (transformAnimationFrame !== 0) {
        cancelAnimationFrame(transformAnimationFrame)
      }
      scrollWrapper.removeEventListener('scroll', scheduleTransformUpdate)
    }
  }, [stickyHeader, updateStickyHeaderTransform])

  const handleStickyHeaderWheel = React.useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return
      }

      const scrollWrapper = scrollWrapperRef.current
      if (!scrollWrapper) {
        return
      }

      scrollWrapper.scrollLeft += event.deltaX
      event.preventDefault()
    },
    [],
  )

  if (isEmpty) {
    return <TableEmptyState />
  }

  return (
    <>
      <Table
        tableWrapperClassName={props.tableWrapperClassName}
        scrollWrapperRef={scrollWrapperRef}
        tableRef={tableRef}
      >
        {groupedHeader && <ColGroup headers={groupedHeader.headers} />}
        <TableHeader>
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
      {stickyHeader && (
        <BasicTableStickyHeader
          groupedHeader={groupedHeader}
          actualHeader={actualHeader}
          scrollLeft={scrollWrapperRef.current?.scrollLeft ?? 0}
          stickyHeaderContentRef={stickyHeaderContentRef}
          stickyHeaderState={stickyHeaderState}
          onWheel={handleStickyHeaderWheel}
        />
      )}
    </>
  )
}

function BasicTableStickyHeader<T>({
  groupedHeader,
  actualHeader,
  scrollLeft,
  stickyHeaderContentRef,
  stickyHeaderState,
  onWheel,
}: {
  groupedHeader: HeaderGroup<T> | undefined
  actualHeader: HeaderGroup<T>
  scrollLeft: number
  stickyHeaderContentRef: React.Ref<HTMLDivElement>
  stickyHeaderState: StickyHeaderState
  onWheel: React.WheelEventHandler<HTMLDivElement>
}) {
  if (
    !stickyHeaderState.active ||
    stickyHeaderState.headerCellWidths.length === 0 ||
    stickyHeaderState.scrollWrapperWidth === 0
  ) {
    return null
  }

  return createPortal(
    <div
      data-sticky-table-header
      className="pointer-events-none fixed z-40 overflow-hidden md:pointer-events-auto"
      style={{
        left: stickyHeaderState.scrollWrapperLeft,
        top: stickyHeaderState.top,
        width: stickyHeaderState.scrollWrapperWidth,
      }}
      onWheel={onWheel}
    >
      <div
        ref={stickyHeaderContentRef}
        style={{
          ['--table-sticky-scroll-x' as string]: `${scrollLeft}px`,
          backfaceVisibility: 'hidden',
          transform: `translate3d(${-scrollLeft}px, 0, 0)`,
          width: stickyHeaderState.tableWidth,
          willChange: 'transform',
        }}
      >
        <table
          className="w-full border-collapse text-left"
          cellSpacing={0}
          cellPadding={0}
          style={{ width: stickyHeaderState.tableWidth }}
        >
          <TableHeader>
            {groupedHeader && (
              <BasicTableGroupedHeaderRow
                groupedHeader={groupedHeader}
                stickyScrollOffsetVar="--table-sticky-scroll-x"
              />
            )}
            <BasicTableActualHeaderRow
              actualHeader={actualHeader}
              headerCellWidths={stickyHeaderState.headerCellWidths}
              stickyScrollOffsetVar="--table-sticky-scroll-x"
            />
            <BasicTableHeaderDividerRow />
          </TableHeader>
        </table>
      </div>
    </div>,
    document.body,
  )
}

function BasicTableGroupedHeaderRow<T>({
  groupedHeader,
  stickyScrollOffset,
  stickyScrollOffsetVar,
}: {
  groupedHeader: HeaderGroup<T>
  stickyScrollOffset?: number
  stickyScrollOffsetVar?: string
}) {
  const shouldRenderGroupedHeaderRow = groupedHeader.headers.some(
    (header) => !header.isPlaceholder && !!header.column.columnDef.header,
  )
  if (!shouldRenderGroupedHeaderRow) {
    return null
  }

  return (
    <TableHeaderRow>
      {groupedHeader.headers.map((header, index) => {
        const isLast = index === groupedHeader.headers.length - 1
        return (
          <React.Fragment key={header.id}>
            <th
              colSpan={header.colSpan}
              className={getBasicTableGroupedHeaderCellClassName({
                isPlaceholder: header.isPlaceholder,
                hasHeader: !!header.column.columnDef.header,
              })}
              style={getCommonPinningStyles(header.column, {
                scrollOffset: stickyScrollOffset,
                scrollOffsetVar: stickyScrollOffsetVar,
                zIndex: 30,
              })}
            >
              {!header.isPlaceholder &&
                !!header.column.columnDef.header &&
                flexRender(header.column.columnDef.header, header.getContext())}
            </th>
            {!header.isPlaceholder && !isLast && (
              <BasicTableColumnFiller as="th" className="bg-header-secondary" />
            )}
          </React.Fragment>
        )
      })}
    </TableHeaderRow>
  )
}

function BasicTableActualHeaderRow<T>({
  actualHeader,
  headerCellWidths,
  stickyScrollOffset,
  stickyScrollOffsetVar,
}: {
  actualHeader: HeaderGroup<T>
  headerCellWidths?: number[]
  stickyScrollOffset?: number
  stickyScrollOffsetVar?: string
}) {
  let renderedCellIndex = -1

  return (
    <TableHeaderRow>
      {actualHeader.headers.map((header, index) => {
        const isLast = index === actualHeader.headers.length - 1
        const groupParams = getBasicTableGroupParams(header.column)
        renderedCellIndex += 1
        const headerCellWidth = headerCellWidths?.[renderedCellIndex]
        return (
          <React.Fragment key={`${actualHeader.id}-${header.id}`}>
            <TableHead
              colSpan={header.colSpan}
              className={getBasicTableHeaderCellClassName({
                groupParams,
                headClassName: header.column.columnDef.meta?.headClassName,
              })}
              align={header.column.columnDef.meta?.align}
              tooltip={header.column.columnDef.meta?.tooltip}
              style={{
                ...getHeaderCellWidthStyle(headerCellWidth),
                ...getCommonPinningStyles(header.column, {
                  scrollOffset: stickyScrollOffset,
                  scrollOffsetVar: stickyScrollOffsetVar,
                  zIndex: 30,
                }),
              }}
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
            {groupParams?.isLastInGroup &&
              !isLast &&
              (() => {
                renderedCellIndex += 1
                const fillerWidth = headerCellWidths?.[renderedCellIndex]
                return (
                  <BasicTableColumnFiller
                    as="th"
                    className="bg-surface-primary"
                    style={getHeaderCellWidthStyle(fillerWidth)}
                  />
                )
              })()}
          </React.Fragment>
        )
      })}
    </TableHeaderRow>
  )
}

function BasicTableHeaderDividerRow() {
  return (
    <TableHeaderRow>
      <th colSpan={100} className="bg-surface-primary p-0">
        <div className="mx-0.5 h-0.5 rounded-full bg-divider" />
      </th>
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
      style: getCommonPinningStyles(cellData.cell.column),
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
          <td colSpan={row.getVisibleCells().length} className="max-w-0">
            {renderedSubComponent}
          </td>
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
  className,
  rowSpan,
  colSpan,
  style,
}: {
  as: 'th' | 'colgroup' | 'td'
  className?: string
  rowSpan?: number
  colSpan?: number
  style?: React.CSSProperties
}) {
  return (
    <Comp
      className={cn(getBasicTableColumnFillerClassName(), className)}
      rowSpan={rowSpan}
      colSpan={colSpan}
      style={style}
    />
  )
}

function areStickyHeaderStatesEqual(
  previousState: StickyHeaderState,
  nextState: StickyHeaderState,
) {
  return (
    previousState.active === nextState.active &&
    areNumbersClose(
      previousState.scrollWrapperLeft,
      nextState.scrollWrapperLeft,
    ) &&
    areNumbersClose(
      previousState.scrollWrapperWidth,
      nextState.scrollWrapperWidth,
    ) &&
    areNumbersClose(previousState.tableWidth, nextState.tableWidth) &&
    areNumbersClose(previousState.top, nextState.top) &&
    previousState.headerCellWidths.length ===
      nextState.headerCellWidths.length &&
    previousState.headerCellWidths.every((width, index) =>
      areNumbersClose(width, nextState.headerCellWidths[index]),
    )
  )
}

function areNumbersClose(a: number, b: number | undefined) {
  if (b === undefined) {
    return false
  }

  return Math.abs(a - b) < 0.5
}

function getHeaderCellWidthStyle(
  width: number | undefined,
): React.CSSProperties {
  if (width === undefined) {
    return {}
  }

  return {
    maxWidth: width,
    minWidth: width,
    width,
  }
}
