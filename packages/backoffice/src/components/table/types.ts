import type { FilterFn, Row, RowData } from '@tanstack/react-table'
import type { ReactNode } from 'react'

interface CsvValueContext<TData extends RowData, TValue> {
  row: Row<TData>
  value: TValue
}

export type ColumnFilterMeta = {
  kind: 'select'
  label?: string
  getOptionLabel?: (value: unknown) => ReactNode
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    excludeFromCsv?: boolean
    csvHeader?: string
    getCsvValue?: (args: CsvValueContext<TData, TValue>) => string
    filter?: ColumnFilterMeta
  }

  interface FilterFns {
    fuzzy: FilterFn<unknown>
    scalarSelect: FilterFn<unknown>
  }
}
