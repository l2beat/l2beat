import type { Row, RowData } from '@tanstack/react-table'

type FuzzySearchValue =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined
  | readonly unknown[]
  | Record<string, unknown>

interface CsvValueContext<TData extends RowData, TValue> {
  row: Row<TData>
  value: TValue
}

interface FuzzySearchValueContext<TData extends RowData, TValue> {
  row: TData
  value: TValue | undefined
  rowIndex: number
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    csvHeader?: string
    csvValue?: (args: CsvValueContext<TData, TValue>) => string
    fuzzySearch?: boolean
    getFuzzySearchValue?: (
      args: FuzzySearchValueContext<TData, TValue>,
    ) => FuzzySearchValue
  }
}

export {}
