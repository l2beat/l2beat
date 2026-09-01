import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { L2RiskCentralizedSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'
import { l2CentralizedSequencingColumns } from './columns'

interface Props {
  entries: L2RiskCentralizedSequencingEntry[]
}

export function CentralizedSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable({
    data: entries,
    columns: l2CentralizedSequencingColumns,
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
        <div className="min-w-0 md:flex-1">
          <h2 className="font-bold text-heading-16 md:text-heading-20">
            Centralized sequencing
          </h2>
          <p className="mt-1 text-paragraph-14 text-secondary md:text-paragraph-15">
            Inclusion columns show how a user bypasses censorship by the
            centralized operator while the chain is live. Exit covers the worst
            case where state proposers stop. Delays assume Ethereum includes the
            required L1 transactions.
          </p>
        </div>
        <ColumnsControls columns={table.getAllColumns()} />
      </div>
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
