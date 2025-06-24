import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { RollupsTable } from '~/components/table/RollupsTable'
import { useTable } from '~/hooks/useTable'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { getEcosystemProjectsColumns } from './table/Columns'
import { EcosystemWidget } from './widgets/EcosystemWidget'

interface Props {
  entries: EcosystemProjectEntry[]
  ecosystemId: ProjectId
}

export function EcosystemProjectsTable({ entries, ecosystemId }: Props) {
  const table = useTable({
    data: entries,
    columns: getEcosystemProjectsColumns(ecosystemId),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
    },
  })
  return (
    <EcosystemWidget className="!pb-0 !pt-3 max-md:-mx-4 mt-[calc(var(--spacing)*1.5)] rounded-b-none">
      <RollupsTable table={table} />
    </EcosystemWidget>
  )
}
