'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useTable } from '~/hooks/use-table'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { BasicDaTable } from '../../../_components/basic-da-table'
import { customColumns } from './columns'

export function DaSummaryCustomTable({ items }: { items: DaSummaryEntry[] }) {
  const table = useTable({
    columns: customColumns,
    data: items,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <BasicDaTable table={table} />
}
