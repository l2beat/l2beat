'use client'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { TokenTable } from '~/app/_components/table/token-breakdown-table'
import { type ExtendedProjectTvlBreakdown } from '../../_utils/assign-token-meta-to-breakdown'
import { nativelyMintedColumns } from './columns/natively-minted-columns'
import { TableSum } from './table-sum'

export type NativelyMintedTokenEntry =
  ExtendedProjectTvlBreakdown['breakdown']['native'][number]

interface Props {
  tokens: NativelyMintedTokenEntry[]
}

export function NativelyMintedTable(props: Props) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns: nativelyMintedColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mb-3 ml-1 mt-12 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Natively Minted Value
      </h2>
      <TokenTable table={table} />
      <TableSum amount={sum} />
    </div>
  )
}
