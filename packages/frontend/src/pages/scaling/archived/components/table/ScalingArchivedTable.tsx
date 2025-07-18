import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingArchivedEntry } from '~/server/features/scaling/archived/getScalingArchivedEntries'
import { getScalingArchivedColumns } from './columns'

interface Props {
  entries: ScalingArchivedEntry[]
  hideType?: boolean
}

export function ScalingArchivedTable({ entries, hideType }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const table = useTable({
    data: entries,
    columns: getScalingArchivedColumns(hideType),
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
