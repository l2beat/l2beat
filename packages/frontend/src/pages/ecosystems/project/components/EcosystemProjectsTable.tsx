import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTable } from '~/hooks/useTable'
import { scalingSummaryColumns } from '~/pages/scaling/summary/components/table/Columns'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { EcosystemWidget } from './widgets/EcosystemWidget'

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
        left: ['#', './Logo'],
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
    <EcosystemWidget className="!pb-0 !pt-3 max-md:-mx-4 mt-[calc(var(--spacing)*1.5)] rounded-b-none">
      <RollupsTable table={table} />
    </EcosystemWidget>
  )
}
