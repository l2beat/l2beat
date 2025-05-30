import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTableSorting } from '~/components/table/sorting/table-sorting-context'
import { useTable } from '~/hooks/use-table'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import { columns } from './columns'

export interface Props {
  entries: ScalingDaEntry[]
  rollups?: boolean
}

export function ScalingDaTable({ entries, rollups }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: columns,
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

  return rollups ? <RollupsTable table={table} /> : <BasicTable table={table} />
}
