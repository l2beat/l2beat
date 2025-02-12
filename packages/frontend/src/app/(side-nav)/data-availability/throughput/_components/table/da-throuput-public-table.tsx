'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useTable } from '~/hooks/use-table'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { BasicDaTable } from '../../../_components/basic-da-table'
import { publicSystemsColumns } from './columns'

export function DaThroughputPublicTable({
  items,
}: { items: DaThroughputEntry[] }) {
  const table = useTable({
    columns: publicSystemsColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <BasicDaTable table={table} />
}
