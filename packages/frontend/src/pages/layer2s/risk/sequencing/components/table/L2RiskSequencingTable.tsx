import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { TableSectionHeader } from '~/components/table/TableSectionHeader'
import { useTable } from '~/hooks/useTable'
import type { L2RiskSequencingEntry } from '~/server/features/layer2s/risks/sequencing/getL2RiskSequencingEntries'
import { l2SequencingColumns } from './columns'

interface Props {
  entries: L2RiskSequencingEntry[]
}

export function L2RiskSequencingTable({ entries }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const table = useTable('L2RiskSequencingTable', {
    data: entries,
    columns: l2SequencingColumns,
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
      <TableSectionHeader title="Decentralized sequencing">
        <ColumnsControls columns={table.getAllColumns()} />
      </TableSectionHeader>
      <BasicTable table={table} />
    </>
  )
}
