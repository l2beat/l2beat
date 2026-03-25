import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { api } from '~/trpc/React'
import { type PairRow, topPairsColumns } from './columns'

export type PairsQueryInput = {
  id: ProjectId | undefined
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
}

export function PairsTable({ queryInput }: { queryInput: PairsQueryInput }) {
  const { data, isLoading } = api.interop.pairs.useQuery(queryInput)

  const table = useTable<PairRow>({
    data: data ?? [],
    columns: topPairsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [{ id: 'volume', desc: true }],
    },
  })

  return (
    <BasicTable
      skeletonCount={6}
      table={table}
      tableWrapperClassName="pb-0"
      isLoading={isLoading}
    />
  )
}
