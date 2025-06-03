import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'React'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'

import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import type { BridgesArchivedEntry } from '~/server/features/bridges/getBridgesArchivedEntries'
import { getBridgesArchivedColumns } from './Columns'

export interface Props {
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
        left: ['#', './Logo'],
      },
    },
  })

  return <BasicTable table={activeTable} />
}
