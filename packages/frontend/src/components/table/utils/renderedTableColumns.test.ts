import { assert } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import { expect } from 'earl'
import { withChangeSort } from '../sorting/changeSortColumn'
import { getBasicTableGroupParams } from './getBasicTableGroupParams'
import { getBasicTableHeaderSections } from './getBasicTableHeaderSections'
import {
  getRenderedCells,
  getRenderedColSpan,
  getRenderedHeaders,
} from './renderedTableColumns'

interface Row {
  total: number
  totalChange: number
}

const columnHelper = createColumnHelper<Row>()

describe('rendered table columns', () => {
  it('excludes change-sort companions from headers, cells, and grouped colSpan', () => {
    const table = createTable({
      data: [{ total: 1, totalChange: 0.1 }],
      columns: [
        columnHelper.group({
          id: 'data',
          header: 'Data',
          columns: withChangeSort(
            columnHelper,
            columnHelper.accessor('total', {
              id: 'total',
              header: 'Total',
            }),
            (row) => ({
              change: row.totalChange,
              period: '7D' as const,
            }),
          ),
        }),
      ],
      getCoreRowModel: getCoreRowModel(),
      renderFallbackValue: null,
      state: {},
      onStateChange: () => {},
    })
    table.setOptions((prev) => ({
      ...prev,
      state: table.initialState,
    }))

    const { groupedHeader, actualHeader } = getBasicTableHeaderSections(
      table.getHeaderGroups(),
    )
    assert(groupedHeader, 'expected a grouped header')
    const groupHeader = groupedHeader.headers[0]
    assert(groupHeader, 'expected a data group header')
    const totalColumn = table.getColumn('total')
    assert(totalColumn, 'expected a total column')
    const row = table.getRowModel().rows[0]
    assert(row, 'expected a row')

    expect(groupHeader.colSpan).toEqual(2)
    expect(getRenderedColSpan(groupHeader)).toEqual(1)
    expect(
      getRenderedHeaders(actualHeader.headers).map(
        (header) => header.column.id,
      ),
    ).toEqual(['total'])
    expect(
      getRenderedCells(row.getVisibleCells()).map((cell) => cell.column.id),
    ).toEqual(['total'])
    expect(getBasicTableGroupParams(totalColumn)).toEqual({
      headerTitle: 'Data',
      isFirstInGroup: true,
      isLastInGroup: true,
    })
  })
})
