/// <reference types="vite/client" />

import '@tanstack/react-table'
import type { CellContext } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { SsrData } from './src/pages/pageTypes'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    cellClassName?: string
    headClassName?: string
    align?: 'right' | 'center'
    hideIfNull?: boolean
    tooltip?: ReactNode
    /**
     * TanStack column that BasicTable does not render. Used to sort by
     * percentage change; excluded from the column picker via enableHiding: false.
     */
    isChangeSortColumn?: boolean
    /**
     * Id of the sort-only companion column that sorts this cell by percentage
     * change. Renders a second sort control in the header.
     */
    changeSortColumnId?: string
    /**
     * @see BasicDaTable
     * How many rows a cell should span across
     */
    rowSpan?: (ctx: CellContext<TData, TValue>) => number
    /**
     * @see BasicTable
     * How many columns a cell should span across
     */
    colSpan?: (ctx: CellContext<TData, TValue>) => number
    /**
     * @see BasicDaTable
     * Columns marked as virtual will not be rendered in the table and must be rendered by the parent row spans
     */
    additionalRows?: (ctx: CellContext<TData, TValue>) => ReactNode[]
  }
}

declare global {
  var __FIX_SSR_URL__: string

  interface Window {
    __SSR_DATA__: SsrData
    __ENV__: Record<string, string>
    op: {
      q?: string[][]
      (
        ...args: [
          (
            | 'init'
            | 'track'
            | 'identify'
            | 'setGlobalProperties'
            | 'increment'
            | 'decrement'
            | 'clear'
          ),
          ...unknown[],
        ]
      ): void
    }
  }
}
