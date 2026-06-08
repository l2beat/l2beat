import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingSequencingEntry } from '~/server/features/scaling/sequencing/getScalingSequencingEntries'
import { scalingSequencingColumns } from './columns'

interface Props {
  entries: ScalingSequencingEntry[]
}

export function ScalingSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: scalingSequencingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    <PrimaryCard className="mt-4">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h2 className="font-bold text-heading-16 md:text-heading-20">
          Decentralized Sequencing
        </h2>
        <ColumnsControls columns={table.getAllColumns()} />
      </div>
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
