'use client'

import type { ExpandedState } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { TokenTable } from '~/components/table/token-breakdown-table'
import type { ProjectTvsBreakdown } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'
import { getCanonicallyBridgedColumns } from './columns/canonically-bridged-columns'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'

export type CanonicallyBridgedTokenEntry =
  ProjectTvsBreakdown['breakdown']['canonical'][number]

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

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
        Canonically Bridged Value
      </h2>

      <TokenTable table={table} />
      <TableSum amount={usdSum} />
    </div>
  )
}
