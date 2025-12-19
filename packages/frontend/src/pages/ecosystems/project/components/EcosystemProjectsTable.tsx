import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import { useEcosystemDisplayControlsContext } from '~/components/table/display/contexts/EcosystemDisplayControlsContext'
import { useTableSorting } from '~/components/table/sorting/TableSortingContext'
import { useTable } from '~/hooks/useTable'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { getEcosystemProjectsColumns } from './table/columns'
import { toTableRows } from './utils/toTableRows'

interface Props {
  entries: EcosystemProjectEntry[]
  ecosystemId: ProjectId
}

export function EcosystemProjectsTable({ entries, ecosystemId }: Props) {
  const { sorting, setSorting } = useTableSorting()
  const {
    display: { excludeRwaRestrictedTokens },
  } = useEcosystemDisplayControlsContext()

  const data = useMemo(
    () =>
      toTableRows({
        projects: entries,
        excludeRwaRestrictedTokens,
      }),
    [entries, excludeRwaRestrictedTokens],
  )

  const columns = useMemo(
    () => getEcosystemProjectsColumns(ecosystemId),
    [ecosystemId],
  )

  const table = useTable({
    data,
    columns,
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

  return (
    <>
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </>
  )
}
