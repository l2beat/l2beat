import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { useTable } from '~/hooks/useTable'
import type { ScalingUpcomingEntry } from '~/server/features/scaling/upcoming/getScalingUpcomingEntries'
import { scalingUpcomingColumns } from './columns'

interface Props {
  entries: ScalingUpcomingEntry[]
}

export function ScalingUpcomingTable({ entries }: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
  )

  const table = useTable({
    data: filteredEntries,
    columns: scalingUpcomingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <PrimaryCard className="mt-4">
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
