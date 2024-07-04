import '@tanstack/react-table'
import { type ReactNode } from 'react'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    hash?: string
    cellClassName?: string
    headClassName?: string
    tooltip?: ReactNode
  }
}
