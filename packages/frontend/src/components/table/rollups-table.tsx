import { type StageConfig } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
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
  const rows = props.table.getRowModel().rows
  const ethereumEntry = rows.find(p => p.original.id === ProjectId.ETHEREUM)
  const stageTwoAndOne = rows.filter(
    (row) =>
      row.original.stage.stage === 'Stage 2' ||
      row.original.stage.stage === 'Stage 1',
  )
  const stageZero = rows.filter((row) => row.original.stage.stage === 'Stage 0')
  const rest = rows.filter(
    (row) =>
      row.original.stage.stage !== 'Stage 2' &&
      row.original.stage.stage !== 'Stage 1' &&
      row.original.stage.stage !== 'Stage 0' &&
      row.original.id !== ProjectId.ETHEREUM,
  )

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
      {rest.length !== 0 && <RowDivider>Other projects</RowDivider>}
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
      <td colSpan={100} className={cn('px-0 group-first:pt-1', className)}>
        <div className="rounded bg-surface-tertiary px-2 py-1 text-2xs font-medium leading-none text-zinc-500 dark:text-n-zinc-300">
          {children}
        </div>
      </td>
    </tr>
  )
}
