import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { TokenTable } from '~/components/table/TokenBreakdownTable'
import type { ProjectTvsBreakdown } from '~/server/features/scaling/tvs/breakdown/getTvsBreakdownForProject'
import { externallyBridgedColumns } from './columns/ExternallyBridgedColumns'
import { renderFormulaSubComponent } from './FormulaSubRow'
import { sumTokensValue } from './sumTokensValue'
import { TableSum } from './TableSum'

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
      <h2 className="mb-3 font-bold text-xl md:mb-4 md:text-2xl">
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
