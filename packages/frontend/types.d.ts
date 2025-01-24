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
    hideIfNull?: boolean
    tooltip?: ReactNode
    /**
     * @see BasicDaTable
     * How many rows a cell should span across
     */
    rowSpan?: (cell: CellContext<TData, TValue>) => number
    /**
     * @see BasicTable
     * How many columns a cell should span across
     */
    colSpan?: (cell: CellContext<TData, TValue>) => number
    /**
     * @see BasicDaTable
     * Columns marked as virtual will not be rendered in the table and must be rendered by the parent row spans
     */
    virtual?: boolean
  }
}
