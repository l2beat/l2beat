import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useTable } from '~/hooks/useTable'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { useIncludeLayer2sOnly } from '../DaThroughputContext'
import type { DaThroughputTableData } from './columns'
import { publicSystemsColumns } from './columns'

interface Props {
  items: DaThroughputEntry[]
}

export function DaThroughputPublicTable({ items }: Props) {
  const { includeLayer2sOnly } = useIncludeLayer2sOnly()

  const tableEntries = useMemo(
    () => items.map((item) => toTableEntry(item, includeLayer2sOnly)),
    [items, includeLayer2sOnly],
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

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}

function toTableEntry(
  entry: DaThroughputEntry,
  includeLayer2sOnly: boolean,
): DaThroughputTableData {
  return {
    ...entry,
    data: includeLayer2sOnly ? entry.layer2sOnlyData : entry.data,
  }
}
