import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { api } from '~/trpc/React'
import { type TokensPairRow, topTokensPairsColumns } from './columns'

export type TokensPairsQueryInput = {
  id: ProjectId | undefined
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
}

export function TokensPairsTable({
  queryInput,
  hideSameToken,
}: {
  queryInput: TokensPairsQueryInput
  hideSameToken?: boolean
}) {
  const { data, isLoading } = api.interop.tokensPairs.useQuery(queryInput)

  const filteredData = useMemo(() => {
    const rows = data ?? []
    if (!hideSameToken) return rows
    return rows.filter((row) => row.tokenA.symbol !== row.tokenB.symbol)
  }, [data, hideSameToken])

  const table = useTable<TokensPairRow>({
    data: filteredData,
    columns: topTokensPairsColumns,
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
