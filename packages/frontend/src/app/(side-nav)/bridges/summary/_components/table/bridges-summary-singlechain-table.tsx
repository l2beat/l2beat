'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import type { BridgesSummaryEntry } from 'rewrite/src/server/features/bridges/get-bridges-summary-entries'
import { bridgesSummarySingleChainColumns } from './singlechain-columns'

export interface Props {
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

  return <BasicTable table={activeTable} />
}
