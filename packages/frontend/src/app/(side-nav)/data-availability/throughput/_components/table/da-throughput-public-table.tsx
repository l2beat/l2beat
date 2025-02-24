'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTable } from '~/hooks/use-table'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { BasicDaTable } from '../../../_components/basic-da-table'
import { useIncludeScalingOnly } from '../../_context/da-throughput-context'
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
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <BasicDaTable table={table} />
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
