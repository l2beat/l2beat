'use client'

import type { ExpandedState } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import { TokenTable } from '~/components/table/token-breakdown-table'
import type { ProjectTvsBreakdown } from '~/server/features/scaling/new-tvs/breakdown/get-tvs-breakdown-for-project'
import { getCanonicallyBridgedColumns } from './columns/canonically-bridged-columns'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'

export type CanonicallyBridgedTokenEntry =
  ProjectTvsBreakdown['canonical'][number]

interface Props {
  tokens: CanonicallyBridgedTokenEntry[]
  id: string
}

export function CanonicallyBridgedTable(props: Props) {
  const usdSum = sumTokensValue(props.tokens)

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns: getCanonicallyBridgedColumns(),
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
        <a href={`#${props.id}`}>Canonically Bridged Value</a>
      </h2>

      <TokenTable table={table} />
      <TableSum amount={usdSum} />
    </div>
  )
}
