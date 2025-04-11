'use client'

import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { TokenTable } from '~/components/table/token-breakdown-table'
import type { ProjectTvsBreakdown } from '~/server/features/scaling/new-tvs/breakdown/get-tvs-breakdown-for-project'
import { canonicallyBridgedColumns } from './columns/canonically-bridged-columns'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'
import { renderFormulaSubComponent } from './formula-sub-row'
import { useMemo } from 'react'

export type CanonicallyBridgedTokenEntry =
  ProjectTvsBreakdown['canonical'][number]

interface Props {
  tokens: CanonicallyBridgedTokenEntry[]
  id: string
}

export function CanonicallyBridgedTable(props: Props) {
  const usdSum = useMemo(() => sumTokensValue(props.tokens), [props.tokens])

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns: canonicallyBridgedColumns,
    getRowCanExpand: (row) => !!row.original.formula,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
        <a href={`#${props.id}`}>Canonically Bridged Value</a>
      </h2>

      <TokenTable
        table={table}
        renderSubComponent={renderFormulaSubComponent}
      />
      <TableSum amount={usdSum} />
    </div>
  )
}
