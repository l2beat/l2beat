'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { RollupsTable } from '~/components/table/rollups-table'
import { useTable } from '~/hooks/use-table'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
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
    <EcosystemWidget>
      <RollupsTable table={table} />
    </EcosystemWidget>
  )
}
