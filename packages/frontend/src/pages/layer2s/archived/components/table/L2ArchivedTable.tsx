import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { TableSectionHeader } from '~/components/table/TableSectionHeader'
import { useTable } from '~/hooks/useTable'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { l2ArchivedColumns } from './columns'

interface Props {
  entries: L2ArchivedEntry[]
  title: string
  description: string
  icon: ReactNode
}

export function L2ArchivedTable({ entries, title, description, icon }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const table = useTable('L2ArchivedTable', {
    data: entries,
    columns: l2ArchivedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <TableSectionHeader
        title={title}
        description={description}
        icon={icon}
        count={entries.length}
      >
        <ColumnsControls columns={table.getAllColumns()} />
      </TableSectionHeader>
      <BasicTable table={table} />
    </>
  )
}
