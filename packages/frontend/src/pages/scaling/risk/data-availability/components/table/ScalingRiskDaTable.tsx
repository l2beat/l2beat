import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingRiskDaEntry } from '~/server/features/scaling/risks/data-availability/getScalingRiskDaEntries'
import { getScalingRiskDataAvailabilityColumns } from './columns'

interface Props {
  entries: ScalingRiskDaEntry[]
  hideType?: boolean
}

export function ScalingRiskDaTable({ entries, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: getScalingRiskDataAvailabilityColumns(hideType),
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

  return <BasicTable table={table} />
}
