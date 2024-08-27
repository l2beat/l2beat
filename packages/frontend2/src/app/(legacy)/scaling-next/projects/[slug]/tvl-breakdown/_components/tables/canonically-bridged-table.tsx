'use client'

import {
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { TokenTable } from '~/app/_components/table/token-breakdown-table'
import { useTable } from '~/hooks/use-table'
import { type ExtendedProjectTvlBreakdown } from '../../_utils/assign-token-meta-to-breakdown'
import { canonicallyBridgedColumns } from './columns/canonically-bridged-columns'
import { TableSum } from './table-sum'

export type CanonicallyBridgedTokenEntry =
  ExtendedProjectTvlBreakdown['breakdown']['canonical'][number]

interface Props {
  tokens: CanonicallyBridgedTokenEntry[]
}

export function CanonicallyBridgedTable(props: Props) {
  const sum = props.tokens.reduce((acc, token) => {
    return acc + Number(token.usdValue)
  }, 0)

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useTable({
    data: props.tokens,
    columns: canonicallyBridgedColumns,
    state: {
      expanded,
    },
    initialState: {},
    onExpandedChange: setExpanded,
    getSubRows: (row) =>
      row.escrows.length > 1
        ? row.escrows.map((escrow) => ({
            ...row,
            // Port escrow to sub row
            amount: escrow.amount,
            usdValue: escrow.usdValue,
            escrows: [escrow],
          }))
        : undefined,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  if (props.tokens.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col px-4 md:px-0">
      <h2 className="mb-3 ml-1 mt-12 text-xl font-bold md:mb-4 md:ml-2 md:text-2xl">
        Canonically Bridged Value
      </h2>

      <TokenTable table={table} />
      <TableSum amount={sum} />
    </div>
  )
}
