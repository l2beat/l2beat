'use client'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { TokenTable } from '~/components/table/token-breakdown-table'
import type { ProjectTvsBreakdown } from '~/server/features/scaling/new-tvs/breakdown/get-tvs-breakdown-for-project'
import { nativelyMintedColumns } from './columns/natively-minted-columns'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'
import { renderFormulaSubComponent } from './formula-sub-row'

export type NativelyMintedTokenEntry = ProjectTvsBreakdown['native'][number]

interface Props {
  tokens: NativelyMintedTokenEntry[]
  id: string
}

export function NativelyMintedTable(props: Props) {
  const usdSum = sumTokensValue(props.tokens)

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns: nativelyMintedColumns,
    getRowCanExpand: (row) => !!row.original.formula,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
        <a href={`#${props.id}`}>Natively Minted Value</a>
      </h2>
      <TokenTable
        table={table}
        renderSubComponent={renderFormulaSubComponent}
      />
      <TableSum amount={usdSum} />
    </div>
  )
}
