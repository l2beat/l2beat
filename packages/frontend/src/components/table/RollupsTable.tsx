import type { Row, Table } from '@tanstack/react-table'
import type React from 'react'
import { featureFlags } from '~/consts/featureFlags'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { cn } from '~/utils/cn'
import type { BasicTableProps } from './BasicTable'
import { BasicTable, BasicTableRow } from './BasicTable'

interface BasicEntry extends CommonProjectEntry {
  stageOrder: number
}

export function RollupsTable<T extends BasicEntry>(props: BasicTableProps<T>) {
  if (!featureFlags.stageSorting) {
    return <BasicTable {...props} />
  }

  const { ethereumEntry, stageTwoAndOne, stageZero, rest } =
    getRollupsTableRows(props.table)
  return (
    <BasicTable {...props}>
      {ethereumEntry && (
        <BasicTableRow
          row={ethereumEntry}
          table={props.table}
          className="border-b-0!"
        />
      )}
      {stageTwoAndOne.length !== 0 && (
        <RowDivider>Stage 2 & 1 projects</RowDivider>
      )}
      {stageTwoAndOne.map((row, i) => (
        <BasicTableRow
          key={row.id}
          row={row}
          table={props.table}
          className={cn(i === stageTwoAndOne.length - 1 && 'border-b-0!')}
        />
      ))}
      {stageZero.length !== 0 && <RowDivider>Stage 0 projects</RowDivider>}
      {stageZero.map((row, i) => (
        <BasicTableRow
          key={row.id}
          row={row}
          table={props.table}
          className={cn(i === stageZero.length - 1 && 'border-b-0!')}
        />
      ))}
      {rest.length !== 0 && <RowDivider>Under review projects</RowDivider>}
      {rest.map((row, i) => (
        <BasicTableRow
          key={row.id}
          row={row}
          table={props.table}
          className={cn(i === rest.length - 1 && 'border-b-0!')}
        />
      ))}
    </BasicTable>
  )
}

function RowDivider({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <tr className="group/divider">
      <td colSpan={100} className={cn('group-first/divider:pt-1', className)}>
        <div className="h-5 bg-surface-tertiary">
          <div className="sticky left-0 w-max px-2 py-1 font-medium text-2xs text-zinc-500 uppercase leading-none dark:text-n-zinc-300">
            {children}
          </div>
        </div>
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
    if (row.original.stageOrder === 3) {
      ethereumEntry = row
      continue
    }

    if (row.original.stageOrder === 2) {
      stageTwoAndOne.push(row)
      continue
    }

    if (row.original.stageOrder === 1) {
      stageZero.push(row)
      continue
    }

    rest.push(row)
  }

  return { ethereumEntry, stageTwoAndOne, stageZero, rest }
}
