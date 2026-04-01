import type { Row, RowData } from '@tanstack/react-table'

interface CsvValueContext<TData extends RowData, TValue> {
  row: Row<TData>
  value: TValue
}

interface SearchValueContext<TData extends RowData, TValue> {
  row: TData
  value: TValue | undefined
  rowIndex: number
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    csvHeader?: string
    getCsvValue?: (args: CsvValueContext<TData, TValue>) => string
    getSearchValue?: (args: SearchValueContext<TData, TValue>) => string
  }
}
