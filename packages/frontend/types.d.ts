import '@tanstack/react-table'
import type { CellContext } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { SsrData } from '../pages/ClientPageRouter'
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
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

declare global {
  var __FIX_SSR_URL__: string

  interface Window {
    __SSR_DATA__: SsrData
    __ENV__: Record<string, string>
    plausible: Plausible | undefined
  }
}
