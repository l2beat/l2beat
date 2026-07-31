import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { ScalingRiskCentralizedSequencingEntry } from '~/server/features/scaling/risks/sequencing/getScalingRiskSequencingEntries'
import { scalingCentralizedSequencingColumns } from './columns'

interface Props {
  entries: ScalingRiskCentralizedSequencingEntry[]
}

export function CentralizedSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: scalingCentralizedSequencingColumns,
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
    <PrimaryCard className="mt-6">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-bold text-heading-16 md:text-heading-20">
            Centralized sequencing
          </h2>
          <p className="mt-1 max-w-3xl text-paragraph-14 text-secondary md:text-paragraph-15">
            A centralized operator can censor in real time. Live inclusion
            measures how a user bypasses it while the chain continues to
            operate. Exit covers the worst case where state proposers also stop
            and a user must permissionlessly advance and defend the state.
            Delays assume Ethereum includes the required L1 transactions.
          </p>
        </div>
        <ColumnsControls columns={table.getAllColumns()} />
      </div>
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
