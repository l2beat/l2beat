'use client'

import {
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { TokenTable } from '~/components/table/token-breakdown-table'
import { type ProjectTvlBreakdown } from '~/server/features/scaling/tvl/breakdown/get-tvl-breakdown-for-project'
import { getCanonicallyBridgedColumns } from './columns/canonically-bridged-columns'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'

export type CanonicallyBridgedTokenEntry =
  ProjectTvlBreakdown['breakdown']['canonical'][number]

interface Props {
  tokens: CanonicallyBridgedTokenEntry[]
}

export function CanonicallyBridgedTable(props: Props) {
  const usdSum = sumTokensValue(props.tokens)

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const columns = useMemo(() => {
    const anySharedEscrow = props.tokens.some((e) =>
      e.escrows.some((e) => e.isSharedEscrow),
    )
    return getCanonicallyBridgedColumns(anySharedEscrow)
  }, [props.tokens])

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns,
    state: {
      expanded,
    },
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
      <TableSum amount={usdSum} />
    </div>
  )
}
