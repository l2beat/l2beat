'use client'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { TokenTable } from '~/components/table/token-breakdown-table'
import { type ProjectTvlBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { externallyBridgedColumns } from './columns/externally-bridged-columns'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'

export type ExternallyBridgedTokenEntry =
  ProjectTvlBreakdown['breakdown']['external'][number]

interface Props {
  tokens: ExternallyBridgedTokenEntry[]
}

export function ExternallyBridgedTable(props: Props) {
  const usdSum = sumTokensValue(props.tokens)

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns: externallyBridgedColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
        Externally Bridged Value
      </h2>
      <TokenTable table={table} />
      <TableSum amount={usdSum} />
    </div>
  )
}
