import { type StageConfig } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type Row, type Table } from '@tanstack/react-table'
import React from 'react'
import { cn } from '~/utils/cn'
import {
  BasicTable,
  type BasicTableEntry,
  type BasicTableProps,
  BasicTableRow,
} from './basic-table'

interface BasicEntry extends BasicTableEntry {
  stage: StageConfig
}

export function RollupsTable<T extends BasicEntry>(props: BasicTableProps<T>) {
  const { ethereumEntry, stageTwoAndOne, stageZero, rest } =
    getRollupsTableRows(props.table)

  return (
    <BasicTable {...props}>
      {ethereumEntry && <BasicTableRow row={ethereumEntry} {...props} />}
      {stageTwoAndOne.length !== 0 && (
        <RowDivider>Stage 2 & 1 projects</RowDivider>
      )}
      {stageTwoAndOne.map((row, i) => (
        <BasicTableRow
          key={row.id}
          row={row}
          {...props}
          className={cn(i === stageTwoAndOne.length - 1 && '!border-b-0')}
        />
      ))}
      {stageZero.length !== 0 && <RowDivider>Stage 0 projects</RowDivider>}
      {stageZero.map((row, i) => (
        <BasicTableRow
          key={row.id}
          row={row}
          {...props}
          className={cn(i === stageZero.length - 1 && '!border-b-0')}
        />
      ))}
      {rest.length !== 0 && <RowDivider>Under review projects</RowDivider>}
      {rest.map((row, i) => (
        <BasicTableRow
          key={row.id}
          row={row}
          {...props}
          className={cn(i === rest.length - 1 && '!border-b-0')}
        />
      ))}
    </BasicTable>
  )
}

function RowDivider({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <tr className="group">
      <td
        colSpan={3}
        className={cn('sticky left-0 z-1 px-0 group-first:pt-1', className)}
      >
        <div className="h-5 rounded-l bg-surface-tertiary px-2 py-1 text-2xs font-medium leading-none text-zinc-500 dark:text-n-zinc-300">
          {children}
        </div>
      </td>
      <td colSpan={100} className={cn('px-0 group-first:pt-1', className)}>
        <div className="h-5 rounded-r bg-surface-tertiary px-2 py-1"></div>
      </td>
    </tr>
  )
}

function getRollupsTableRows<T extends BasicEntry>(table: Table<T>) {
  const rows = table.getRowModel().rows

  let ethereumEntry: Row<T> | undefined
  const stageTwoAndOne: Row<T>[] = []
  const stageZero: Row<T>[] = []
  const rest: Row<T>[] = []

  for (const row of rows) {
    if (row.original.id === ProjectId.ETHEREUM) {
      ethereumEntry = row
      continue
    }

    if (
      row.original.stage.stage === 'Stage 2' ||
      row.original.stage.stage === 'Stage 1'
    ) {
      stageTwoAndOne.push(row)
      continue
    }

    if (row.original.stage.stage === 'Stage 0') {
      stageZero.push(row)
      continue
    }

    rest.push(row)
  }

  return { ethereumEntry, stageTwoAndOne, stageZero, rest }
}
