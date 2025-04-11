'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { bridgesSummaryActiveColumns } from './columns'

import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

export interface Props {
  entries: BridgesSummaryEntry[]
}

export function BridgesSummaryTable({ entries }: Props) {
  const activeTable = useTable({
    data: entries,
    columns: bridgesSummaryActiveColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
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
