import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { TokenTable } from '~/components/table/token-breakdown-table'
import type { ProjectTvsBreakdown } from '~/server/features/scaling/tvs/breakdown/get-tvs-breakdown-for-project'
import { externallyBridgedColumns } from './columns/externally-bridged-columns'
import { renderFormulaSubComponent } from './formula-sub-row'
import { sumTokensValue } from './sum-tokens-value'
import { TableSum } from './table-sum'

export type ExternallyBridgedTokenEntry =
  ProjectTvsBreakdown['external'][number]

interface Props {
  tokens: ExternallyBridgedTokenEntry[]
  id: string
}

export function ExternallyBridgedTable(props: Props) {
  const usdSum = useMemo(() => sumTokensValue(props.tokens), [props.tokens])

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    getRowCanExpand: (row) => !!row.original.formula,
    columns: externallyBridgedColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col">
      <h2 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl">
        <a href={`#${props.id}`}>Externally Bridged Value</a>
      </h2>
      <TokenTable
        table={table}
        renderSubComponent={renderFormulaSubComponent}
      />
      <TableSum amount={usdSum} />
    </div>
  )
}
