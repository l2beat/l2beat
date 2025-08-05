import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { useTable } from '~/hooks/useTable'
import type { BridgesArchivedEntry } from '~/server/features/bridges/getBridgesArchivedEntries'
import { getBridgesArchivedColumns } from './columns'

interface Props {
  entries: BridgesArchivedEntry[]
  isOthers?: boolean
}

export function BridgesArchivedTable({ entries, isOthers }: Props) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
  )

  const activeTable = useTable({
    data: filteredEntries,
    columns: getBridgesArchivedColumns(isOthers),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <BasicTable table={activeTable} />
}
