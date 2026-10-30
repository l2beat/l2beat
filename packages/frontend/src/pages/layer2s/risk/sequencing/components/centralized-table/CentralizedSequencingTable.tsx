import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { TableSectionHeader } from '~/components/table/TableSectionHeader'
import { useTable } from '~/hooks/useTable'
import type { L2RiskCentralizedSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'
import { l2CentralizedSequencingColumns } from './columns'

interface Props {
  entries: L2RiskCentralizedSequencingEntry[]
}

export function CentralizedSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable('CentralizedSequencingTable', {
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
    <>
      <TableSectionHeader
        title="Centralized sequencing"
        description="Inclusion columns show how a user bypasses censorship by the centralized operator while the chain is live. Exit covers the worst case where state proposers stop. Delays assume Ethereum includes the required L1 transactions."
      >
        <ColumnsControls columns={table.getAllColumns()} />
      </TableSectionHeader>
      <BasicTable table={table} />
    </>
  )
}
