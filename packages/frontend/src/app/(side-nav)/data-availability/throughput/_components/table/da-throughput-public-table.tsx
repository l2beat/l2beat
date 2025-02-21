'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTable } from '~/hooks/use-table'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { BasicDaTable } from '../../../_components/basic-da-table'
import { useIncludeOnlyL2s } from '../../_context/da-throughput-context'
import type { DaThroughputTableData } from './columns'
import { publicSystemsColumns } from './columns'

interface Props {
  items: DaThroughputEntry[]
}

export function DaThroughputPublicTable({ items }: Props) {
  const { includeL2sOnly } = useIncludeOnlyL2s()

  const tableEntries = useMemo(
    () => items.map((item) => toTableEntry(item, includeL2sOnly)),
    [items, includeL2sOnly],
  )

  const table = useTable({
    columns: publicSystemsColumns,
    data: tableEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return <BasicDaTable table={table} />
}

function toTableEntry(
  entry: DaThroughputEntry,
  includeL2sOnly: boolean,
): DaThroughputTableData {
  return {
    ...entry,
    data: includeL2sOnly ? entry.l2sOnlyData : entry.data,
  }
}
