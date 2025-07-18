import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { getEcosystemProjectsColumns } from './table/columns'

interface Props {
  entries: EcosystemProjectEntry[]
  ecosystemId: ProjectId
}

export function EcosystemProjectsTable({ entries, ecosystemId }: Props) {
  const { sorting, setSorting } = useTableSorting()

  const table = useTable({
    data: entries,
    columns: getEcosystemProjectsColumns(ecosystemId),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return <RollupsTable table={table} />
}
