import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { TokenTable } from '~/components/table/TokenBreakdownTable'
import type { BaseAssetBreakdownData } from '~/server/features/scaling/tvs/breakdown/types'
import { columns } from './columns/columns'
import { renderFormulaSubComponent } from './FormulaSubRow'
import { sumTokensValue } from './sumTokensValue'
import { TableSum } from './TableSum'

interface Props {
  tokens: BaseAssetBreakdownData[]
}

export function TvsBreakdownTokenTable(props: Props) {
  const usdSum = useMemo(() => sumTokensValue(props.tokens), [props.tokens])

  const table = useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    data: props.tokens,
    columns: columns,
    getRowCanExpand: (row) => !!row.original.formula,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="flex flex-col">
      <TokenTable
        table={table}
        renderSubComponent={renderFormulaSubComponent}
      />
      <TableSum amount={usdSum} />
    </div>
  )
}
