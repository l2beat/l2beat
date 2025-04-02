'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTable } from '~/hooks/use-table'
import { scalingSummaryColumns } from '../../scaling/summary/_components/table/columns'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function EcosystemProjectsTable({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns: scalingSummaryColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
    },
  })
  return <RollupsTable table={table} />
}
