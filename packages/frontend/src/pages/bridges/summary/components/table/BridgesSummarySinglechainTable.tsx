import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTable } from '~/hooks/useTable'
import type { BridgesSummaryEntry } from '~/server/features/bridges/getBridgesSummaryEntries'
import { bridgesSummarySingleChainColumns } from './SinglechainColumns'

interface Props {
  entries: BridgesSummaryEntry[]
}

export function BridgesSummarySingleChainTable({ entries }: Props) {
  const activeTable = useTable({
    data: entries,
    columns: bridgesSummarySingleChainColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'tvs',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <>
      <ColumnsControls columns={activeTable.getAllColumns()} />
      <BasicTable table={activeTable} />
    </>
  )
}
