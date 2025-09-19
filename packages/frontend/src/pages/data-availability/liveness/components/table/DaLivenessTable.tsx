import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { useLivenessTimeRangeContext } from '~/pages/scaling/liveness/components/LivenessTimeRangeContext'
import type { DaLivenessEntry } from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import { publicColumns } from './columns'
import { toDaLivenessTableEntry } from './toDaLivenessTableEntry'

export function DaLivenessTable({ items }: { items: DaLivenessEntry[] }) {
  const { timeRange } = useLivenessTimeRangeContext()

  const tableEntries = useMemo(
    () => items.map((item) => toDaLivenessTableEntry(item, timeRange)),
    [items, timeRange],
  )

  const table = useTable({
    columns: publicColumns,
    data: tableEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: '#', desc: false }],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <BasicTable table={table} />
}
