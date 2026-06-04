import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingDecentralizedSequencingEntry } from '~/server/features/scaling/decentralized-sequencing/getScalingDecentralizedSequencingEntries'
import { scalingDecentralizedSequencingColumns } from './columns'

interface Props {
  entries: ScalingDecentralizedSequencingEntry[]
}

export function ScalingDecentralizedSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: scalingDecentralizedSequencingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo', 'name'],
      },
    },
  })

  return (
    <PrimaryCard className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
