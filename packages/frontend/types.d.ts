import '@tanstack/react-table'
import { type CellContext } from '@tanstack/react-table'
import { type ReactNode } from 'react'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    hash?: string
    cellClassName?: string
    headClassName?: string
    align?: 'right' | 'center'
    tooltip?: ReactNode
    rowSpan?: (cell: CellContext<TData, unknown>) => number
    virtual?: boolean
    renderSpanFill?: (cell: CellContext<TData, unknown>) => ReactNode
  }
}
