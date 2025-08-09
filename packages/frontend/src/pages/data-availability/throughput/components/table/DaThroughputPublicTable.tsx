import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { useIncludeScalingOnly } from '../DaThroughputContext'
import type { DaThroughputTableData } from './columns'
import { publicSystemsColumns } from './columns'

interface Props {
  items: DaThroughputEntry[]
}

export function DaThroughputPublicTable({ items }: Props) {
  const { includeScalingOnly } = useIncludeScalingOnly()

  const tableEntries = useMemo(
    () => items.map((item) => toTableEntry(item, includeScalingOnly)),
    [items, includeScalingOnly],
  )

  const table = useTable({
    columns: publicSystemsColumns,
    data: tableEntries,
    initialState: {
      sorting: [{ id: 'pastDayAvgThroughputPerSecond', desc: true }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <BasicTable table={table} />
}

function toTableEntry(
  entry: DaThroughputEntry,
  includeScalingOnly: boolean,
): DaThroughputTableData {
  return {
    ...entry,
    data: includeScalingOnly ? entry.scalingOnlyData : entry.data,
  }
}
