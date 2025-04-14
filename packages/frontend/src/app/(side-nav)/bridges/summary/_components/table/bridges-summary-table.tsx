'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { getBridgesSummaryActiveColumns } from './columns'

import type { BridgesSummaryEntry } from '~/server/features/bridges/get-bridges-summary-entries'

export interface Props {
  entries: BridgesSummaryEntry[]
  isOthers?: boolean
}

export function BridgesSummaryTable({ entries, isOthers }: Props) {
  const activeTable = useTable({
    data: entries,
    columns: getBridgesSummaryActiveColumns(isOthers),
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
