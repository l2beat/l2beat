import '@tanstack/react-table'
import { type CellContext } from '@tanstack/react-table'
import { type ReactNode } from 'react'
import {} from 'react/canary'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    hash?: string
    cellClassName?: string
    headClassName?: string
    align?: 'right' | 'center'
    tooltip?: ReactNode
    /**
     * @see DaTable
     * How many rows a cell should span across
     */
    rowSpan?: (cell: CellContext<TData, TValue>) => number
  }
}
