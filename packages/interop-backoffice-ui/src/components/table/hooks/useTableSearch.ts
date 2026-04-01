import type { ColumnDef, RowData } from '@tanstack/react-table'
import fuzzysort from 'fuzzysort'
import { useMemo } from 'react'
import { getAccessorValue, getLeafColumns } from '../utils'

type TableSearchProps<TData extends RowData> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  searchValue: string
}

export function useTableSearch<TData extends RowData>({
  data,
  columns,
  searchValue,
}: TableSearchProps<TData>) {
  const searchableColumns = useMemo(
    () => getSearchableColumns(columns),
    [columns],
  )

  const preparedRows = useMemo(() => {
    return data.map((row, rowIndex) => ({
      row,
      searchTarget: fuzzysort.prepare(
        searchableColumns
          .map((getSearchText) => getSearchText(row, rowIndex))
          .filter((value) => value !== undefined && value.length > 0)
          .join(' '),
      ),
    }))
  }, [data, searchableColumns])

  const filteredData = useMemo(() => {
    if (searchValue === '' || searchableColumns.length === 0) {
      return data
    }

    return fuzzysort
      .go(searchValue, preparedRows, {
        key: 'searchTarget',
        limit: preparedRows.length,
        threshold: 0.3,
      })
      .map((result) => result.obj.row)
  }, [data, searchValue, preparedRows, searchableColumns.length])

  return { filteredData, hasAnySearchableColumns: searchableColumns.length > 0 }
}

function getSearchableColumns<TData extends RowData>(
  columns: ColumnDef<TData, unknown>[],
) {
  return getLeafColumns(columns).flatMap((column) => {
    const isSearchable = column.meta?.getSearchValue !== undefined

    if (!isSearchable) {
      return []
    }

    return [
      (row: TData, rowIndex: number) => {
        const accessorValue = getAccessorValue(column, row, rowIndex)

        return column.meta?.getSearchValue?.({
          row,
          value: accessorValue,
          rowIndex,
        })
      },
    ]
  })
}
