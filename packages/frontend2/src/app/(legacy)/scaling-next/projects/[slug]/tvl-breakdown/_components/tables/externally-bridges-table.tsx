'use client'
import { type Token } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { TokenTable } from '~/app/_components/table/token-breakdown-table'
import { useTable } from '~/hooks/use-table'
import { type TvlProjectBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { externallyBridgedColumns } from './columns/externally-bridged-columns'
import { TableSum } from './table-sum'

type ExternallyBridgedToken =
  TvlProjectBreakdown['breakdowns'][number]['external'][number]

type Meta = {
  symbol: string
  iconUrl: string
  explorerUrl: string
  supply: Token['supply']
}

export type ExternallyBridgedTokenEntry = ExternallyBridgedToken & Meta

interface Props {
  tokens: ExternallyBridgedTokenEntry[]
}

export function ExternallyBridgedTable(props: Props) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  const table = useTable({
    data: props.tokens,
    columns: externallyBridgedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mb-3 ml-1 mt-12 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Externally Bridged Value
      </h2>
      <TokenTable table={table} />
      <TableSum amount={sum} />
    </div>
  )
}
