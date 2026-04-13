import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { api } from '~/trpc/React'
import { getTopTokensColumns, type TokenRow } from './columns'

export type TokensQueryInput = {
  id: ProjectId | undefined
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
}

export function TokensTable({
  queryInput,
  showNetMintedValueColumn,
  showTopProtocolColumn,
}: {
  queryInput: TokensQueryInput
  showNetMintedValueColumn?: boolean
  showTopProtocolColumn?: boolean
}) {
  const { data, isLoading } = api.interop.tokens.useQuery(queryInput)

  const columns = useMemo(
    () =>
      getTopTokensColumns({
        showNetMintedValueColumn,
        showTopProtocolColumn,
      }),
    [showNetMintedValueColumn, showTopProtocolColumn],
  )

  const table = useTable<TokenRow>({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: { left: ['icon'] },
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
