import { type StageConfig } from '@l2beat/config'
import { type Row, flexRender } from '@tanstack/react-table'
import React from 'react'
import { cn } from '~/utils/cn'
import {
  BasicTable,
  BasicTableColumnFiller,
  type BasicTableEntry,
  type BasicTableProps,
  getBasicTableGroupParams,
  getBasicTableHref,
} from './basic-table'
import { TableCell, TableRow } from './table'
import { getCommonPinningStyles } from './utils/common-pinning-styles'
import {
  getRowType,
  getRowTypeClassNames,
  getRowTypeClassNamesWithoutOpacity,
} from './utils/row-type'

interface BasicEntry extends BasicTableEntry {
  stage: StageConfig
}

export function RollupsTable<T extends BasicEntry>(props: BasicTableProps<T>) {
  const stageTwoAndOne = props.table
    .getRowModel()
    .rows.filter(
      (row) =>
        row.original.stage.stage === 'Stage 2' ||
        row.original.stage.stage === 'Stage 1',
    )
  const stageZero = props.table
    .getRowModel()
    .rows.filter((row) => row.original.stage.stage === 'Stage 0')
  const rest = props.table
    .getRowModel()
    .rows.filter(
      (row) =>
        row.original.stage.stage !== 'Stage 2' &&
        row.original.stage.stage !== 'Stage 1' &&
        row.original.stage.stage !== 'Stage 0',
    )

  return (
    <BasicTable {...props}>
      {stageTwoAndOne.length !== 0 && (
        <RowDivider>Stage 2 & 1 projects</RowDivider>
      )}
      {stageTwoAndOne.map((row, i) => (
        <RollupsTableRow
          key={row.id}
          row={row}
          {...props}
          className={cn(i === stageTwoAndOne.length - 1 && '!border-b-0')}
        />
      ))}
      {stageZero.length !== 0 && <RowDivider>Stage 0 projects</RowDivider>}
      {stageZero.map((row, i) => (
        <RollupsTableRow
          key={row.id}
          row={row}
          {...props}
          className={cn(i === stageZero.length - 1 && '!border-b-0')}
        />
      ))}
      {rest.length !== 0 && <RowDivider>Other projects</RowDivider>}
      {rest.map((row, i) => (
        <RollupsTableRow
          key={row.id}
          row={row}
          {...props}
          className={cn(i === rest.length - 1 && '!border-b-0')}
        />
      ))}
    </BasicTable>
  )
}

function RollupsTableRow<T extends BasicEntry>({
  row,
  ...props
}: BasicTableProps<T> & { row: Row<T> }) {
  const rowType = getRowType(row.original, props.rowColoringMode)

  return (
    <>
      <TableRow
        className={cn(
          getRowTypeClassNames(rowType),
          row.getIsExpanded() &&
            props.renderSubComponent?.({ row }) &&
            '!border-none',
          props.className,
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
                  groupParams?.isLastInGroup && 'pr-6',
                  cell.column.getCanSort() && meta?.align !== 'right'
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
          <tr className={cn('border-b', props.className)}>
            {/* 2nd row is a custom 1 cell row */}
            <td colSpan={row.getVisibleCells().length}>
              {props.renderSubComponent({ row })}
            </td>
          </tr>
        ))}
    </>
  )
}

function RowDivider({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <tr>
      <td colSpan={100} className={cn('px-0 first:pt-1', className)}>
        <div className="rounded bg-surface-secondary px-2 py-1 text-2xs font-medium leading-none text-zinc-500 dark:text-n-zinc-300">
          {children}
        </div>
      </td>
    </tr>
  )
}
