import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { getBadgeModalProjectsColumns } from './columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function BadgeModalProjectsTable({ entries }: Props) {
  const columns = useMemo(() => getBadgeModalProjectsColumns(), [])

  // Clear backgroundColor so BasicTable does not apply row highlight colors
  const data = useMemo(
    () =>
      entries.map((e) => ({ ...e, backgroundColor: undefined })),
    [entries],
  )

  const table = useTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'tvs', desc: true }],
      columnPinning: { left: ['#', 'logo'] },
    },
  })

  return <BasicTable table={table} />
}
