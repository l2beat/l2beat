import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
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
    <section className="px-4 md:px-0">
      <div className="rounded-lg bg-surface-primary p-3 md:p-4">
        <ColumnsControls columns={table.getAllColumns()} />
        <BasicTable
          table={table}
          tableOuterWrapperClassName="max-md:mr-0"
          tableWrapperClassName="rounded-lg bg-surface-primary"
          withScrollHint
        />
      </div>
    </section>
  )
}
