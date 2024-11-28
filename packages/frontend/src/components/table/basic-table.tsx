import { assert, type ProjectId } from '@l2beat/shared-pure'
import {
  type Column,
  type Header,
  type Row,
  type Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table'
import { range } from 'lodash'
import React from 'react'
import { cn } from '~/utils/cn'
import { type UnderReviewStatus } from '~/utils/project/under-review'
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
import { getCommonPinningStyles } from './utils/common-pinning-styles'
import {
  getRowType,
  getRowTypeClassNames,
  getRowTypeClassNamesWithoutOpacity,
} from './utils/row-type'

export interface BasicTableEntry {
  id: ProjectId | string
  slug: string
  isVerified?: boolean
  redWarning?: string | undefined
  underReviewStatus?: UnderReviewStatus
  href?: string
}

export interface BasicTableProps<T extends BasicTableEntry> {
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
  rowColoringMode?: 'default' | 'ethereum-only'
}

export function BasicTable<T extends BasicTableEntry>(
  props: BasicTableProps<T>,
) {
  if (props.table.getRowCount() === 0) {
    return <TableEmptyState />
  }
  const headerGroups = props.table.getHeaderGroups()
  const maxDepth = headerGroups.length - 1
  assert(maxDepth <= 1, 'Only 1 level of headers is supported')

  const groupedHeader = maxDepth === 1 ? headerGroups[0] : undefined
  const actualHeader = maxDepth === 1 ? headerGroups[1]! : headerGroups[0]!

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
                        'font-medium tracking-[-0.13px] text-primary',
                        !header.isPlaceholder &&
                          !!header.column.columnDef.header &&
                          'rounded-t-lg px-6 pt-4',
                        header.column.getIsPinned() &&
                          getRowTypeClassNamesWithoutOpacity(null),
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
                      getRowTypeClassNamesWithoutOpacity(null),
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
        {props.children ??
          props.table
            .getRowModel()
            .rows.map((row) => (
              <BasicTableRow row={row} key={row.id} {...props} />
            ))}
        {groupedHeader && <RowFiller headers={groupedHeader.headers} />}
      </TableBody>
    </Table>
  )
}

export function BasicTableRow<T extends BasicTableEntry>({
  row,
  className,
  ...props
}: BasicTableProps<T> & { row: Row<T>; className?: string }) {
  const rowType = getRowType(row.original, props.rowColoringMode)

  return (
    <>
      <TableRow
        className={cn(
          getRowTypeClassNames(rowType),
          row.getIsExpanded() &&
            props.renderSubComponent?.({ row }) &&
            '!border-none',
          className,
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const { meta } = cell.column.columnDef
          const groupParams = getBasicTableGroupParams(cell.column)
          const href = getBasicTableHref(row.original.href, meta?.hash)

          return (
            <React.Fragment key={`${row.id}-${cell.id}`}>
              <TableCell
                href={href}
                align={meta?.align}
                className={cn(
                  cell.column.getIsPinned() &&
                    getRowTypeClassNamesWithoutOpacity(rowType),
                  groupParams?.isFirstInGroup && 'pl-6',
                  groupParams?.isLastInGroup && '!pr-6',
                  cell.column.getCanSort() && meta?.align === undefined
                    ? groupParams?.isFirstInGroup
                      ? 'pl-10'
                      : 'pl-4'
                    : undefined,

                  meta?.cellClassName,
                )}
                style={getCommonPinningStyles(cell.column)}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
              {groupParams?.isLastInGroup && (
                <BasicTableColumnFiller as="td" href={href} />
              )}
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
          className={cn(!header.isPlaceholder && 'bg-surface-table-group')}
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
            header.column.getIsPinned() &&
              getRowTypeClassNamesWithoutOpacity(null),
          )}
          style={getCommonPinningStyles(header.column)}
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

function BasicTableColumnFiller(props: ColumnFillerProps) {
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

export function getBasicTableHref(
  href: string | undefined,
  hash: string | undefined,
) {
  if (!hash) {
    return href
  }

  return `${href}#${hash}`
}
