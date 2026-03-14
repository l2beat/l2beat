import type { Row, RowData } from '@tanstack/react-table'

// https://lucide.dev/guide/advanced/aliased-names
declare module 'lucide-react' {
  export * from 'lucide-react/dist/lucide-react.suffixed'
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    csvHeader?: string
    csvValue?: (params: { row: Row<TData>; value: TValue }) => string
  }
}
