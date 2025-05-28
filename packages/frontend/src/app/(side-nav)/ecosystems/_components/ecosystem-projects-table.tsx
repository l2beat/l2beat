'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import type { ScalingSummaryEntry } from 'rewrite/src/server/features/scaling/summary/get-scaling-summary-entries'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTable } from '~/hooks/use-table'
import { scalingSummaryColumns } from '../../scaling/summary/_components/table/columns'
import { EcosystemWidget } from './widgets/ecosystem-widget'

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
  return (
    <EcosystemWidget className="mt-[calc(var(--spacing)*1.5)] rounded-b-none !pb-0 !pt-3 max-md:-mx-4">
      <RollupsTable table={table} />
    </EcosystemWidget>
  )
}
