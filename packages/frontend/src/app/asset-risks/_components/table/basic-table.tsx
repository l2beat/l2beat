import {
  type Column,
  type Row,
  type Table as TanstackTable,
  flexRender,
} from '@tanstack/react-table'
import React from 'react'
import { cn } from '~/utils/cn'
import { SortingArrows } from './sorting-arrows'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from './table'

export interface BasicTableProps<T> {
  table: TanstackTable<T>
  children?: React.ReactNode
  /**
   * Custom sub component render function
   */
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
  /**
   * If the table is inside a main page card - bypass right margin by adding classes
   */
  insideMainPageCard?: boolean
  rowColoringMode?: 'default' | 'ethereum-only'
}

export function BasicTable<T>(props: BasicTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableHeaderRow>
          {props.table.getHeaderGroups().map((headerGroup) => {
            return headerGroup.headers.map((header) => {
              return (
                <React.Fragment key={`${header.id}`}>
                  <TableHead
                    colSpan={header.colSpan}
                    className={cn(header.column.columnDef.meta?.headClassName)}
                    align={header.column.columnDef.meta?.align}
                    tooltip={header.column.columnDef.meta?.tooltip}
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
            })
          })}
        </TableHeaderRow>
      </TableHeader>
      <TableBody>
        {props.children ??
          props.table
            .getRowModel()
            .rows.map((row) => (
              <BasicTableRow row={row} key={row.id} {...props} />
            ))}
      </TableBody>
    </Table>
  )
}

export function BasicTableRow<T>({
  row,
  className,
  ...props
}: BasicTableProps<T> & { row: Row<T>; className?: string }) {
  return (
    <>
      <TableRow
        className={cn(
          row.getIsExpanded() &&
            props.renderSubComponent?.({ row }) &&
            '!border-none',
          className,
        )}
      >
        {row.getVisibleCells().map((cell) => {
          const { meta } = cell.column.columnDef

          return (
            <React.Fragment key={`${row.id}-${cell.id}`}>
              <TableCell
                align={meta?.align}
                className={cn(
                  cell.column.getCanSort() && meta?.align === undefined
                    ? 'pl-4'
                    : undefined,

                  meta?.cellClassName,
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            </React.Fragment>
          )
        })}
      </TableRow>
      {row.getIsExpanded() && props.renderSubComponent && (
        <TableRow>
          {/* 2nd row is a custom 1 cell row */}
          <td className="px-2 py-6" colSpan={row.getVisibleCells().length}>
            {props.renderSubComponent({ row })}
          </td>
        </TableRow>
      )}
    </>
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

export function getBasicTableHref(
  href: string | undefined,
  hash: string | undefined,
) {
  if (!hash) {
    return href
  }

  return `${href}#${hash}`
}
