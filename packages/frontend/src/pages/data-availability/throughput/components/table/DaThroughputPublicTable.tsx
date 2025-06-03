import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'React'
import { useTable } from '~/hooks/useTable'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { BasicDaTable } from '../../../components/BasicDaTable'
import { useIncludeScalingOnly } from '../DaThroughputContext'
import type { DaThroughputTableData } from './Columns'
import { publicSystemsColumns } from './Columns'

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
        left: ['#', './Logo'],
      },
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
