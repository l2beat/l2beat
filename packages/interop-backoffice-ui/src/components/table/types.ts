import type { FilterFn, Row, RowData } from '@tanstack/react-table'

interface CsvValueContext<TData extends RowData, TValue> {
  row: Row<TData>
  value: TValue
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    excludeFromCsv?: boolean
    csvHeader?: string
    getCsvValue?: (args: CsvValueContext<TData, TValue>) => string
  }

  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
}
