import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'

import type { BridgesSummaryEntry } from '~/server/features/bridges/getBridgesSummaryEntries'
import { bridgesSummaryOthersColumns } from './OthersColumns'

export interface Props {
  entries: BridgesSummaryEntry[]
}

export function BridgesSummaryOthersTable({ entries }: Props) {
  const activeTable = useTable({
    data: entries,
    columns: bridgesSummaryOthersColumns,
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
        left: ['#', './Logo'],
      },
    },
  })

  return <BasicTable table={activeTable} />
}
