import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingDaEntry } from '~/server/features/scaling/data-availability/getScalingDaEntries'
import { getScalingDataAvailabilityColumns } from './columns'

export interface Props {
  entries: ScalingDaEntry[]
  rollups?: boolean
  hideType?: boolean
}

export function ScalingDaTable({ entries, rollups, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: getScalingDataAvailabilityColumns(hideType),
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
