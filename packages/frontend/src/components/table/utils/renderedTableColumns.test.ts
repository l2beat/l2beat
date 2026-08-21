import { assert } from '@l2beat/shared-pure'
import type { ColumnDef, Table } from '@tanstack/react-table'
import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
  getSortedRowModel,
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
  rwa: number
  rwaChange: number
}

const columnHelper = createColumnHelper<Row>()

const totalColumns = withChangeSort(
  columnHelper,
  columnHelper.accessor('total', {
    id: 'total',
    header: 'Total',
  }),
  {
    getChange: (row) => row.totalChange,
    period: '7D',
  },
)

const rwaColumns = withChangeSort(
  columnHelper,
  columnHelper.accessor('rwa', {
    id: 'rwaRestricted',
    header: 'Restricted RWAs',
  }),
  {
    getChange: (row) => row.rwaChange,
    period: '7D',
  },
)

const data: Row[] = [
  { total: 1, totalChange: 0.1, rwa: 10, rwaChange: 0.01 },
  { total: 2, totalChange: 0.2, rwa: 5, rwaChange: 0.5 },
]

describe('rendered table columns', () => {
  it('excludes sort-only companions from headers, cells, and grouped colSpan', () => {
    const table = createProjectionTable([
      columnHelper.group({
        id: 'data',
        header: 'Data',
        columns: totalColumns,
      }),
    ])

    const { groupedHeader, actualHeader } = getBasicTableHeaderSections(
      table.getHeaderGroups(),
    )
    assert(groupedHeader, 'expected a grouped header')
    const groupHeader = groupedHeader.headers[0]
    assert(groupHeader, 'expected a data group header')
    const totalColumn = table.getColumn('total')
    assert(totalColumn, 'expected a total column')

    expect(groupHeader.colSpan).toEqual(2)
    expect(getRenderedColSpan(groupHeader)).toEqual(1)
    expect(renderedHeaderIds(actualHeader.headers)).toEqual(['total'])
    expect(renderedCellIds(table)).toEqual(['total'])
    expect(getBasicTableGroupParams(totalColumn)).toEqual({
      headerTitle: 'Data',
      isFirstInGroup: true,
      isLastInGroup: true,
    })
  })

  it('keeps companions out of the projection after they are added, and still sorts by them', () => {
    const table = createProjectionTable([
      columnHelper.group({
        id: 'data',
        header: 'Data',
        columns: totalColumns,
      }),
    ])

    table.setOptions((prev) => ({
      ...prev,
      columns: [
        columnHelper.group({
          id: 'data',
          header: 'Data',
          columns: [...totalColumns, ...rwaColumns],
        }),
      ],
      state: {
        ...prev.state,
        sorting: [{ id: 'rwaRestrictedChange', desc: true }],
      },
    }))

    const { groupedHeader, actualHeader } = getBasicTableHeaderSections(
      table.getHeaderGroups(),
    )
    assert(groupedHeader, 'expected a grouped header')
    const groupHeader = groupedHeader.headers[0]
    assert(groupHeader, 'expected a data group header')

    expect(groupHeader.colSpan).toEqual(4)
    expect(getRenderedColSpan(groupHeader)).toEqual(2)
    expect(renderedHeaderIds(actualHeader.headers)).toEqual([
      'total',
      'rwaRestricted',
    ])
    expect(renderedCellIds(table)).toEqual(['total', 'rwaRestricted'])
    expect(table.getRowModel().rows.map((row) => row.original.rwa)).toEqual([
      5, 10,
    ])
  })
})

function createProjectionTable(columns: ColumnDef<Row>[]) {
  const table = createTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    renderFallbackValue: null,
    state: {},
    onStateChange: () => {},
  })
  table.setOptions((prev) => ({
    ...prev,
    state: table.initialState,
  }))
  return table
}

function renderedHeaderIds<T>(
  headers: ReturnType<Table<T>['getHeaderGroups']>[number]['headers'],
) {
  return getRenderedHeaders(headers).map((header) => header.column.id)
}

function renderedCellIds(table: Table<Row>) {
  const row = table.getRowModel().rows[0]
  assert(row, 'expected a row')
  return getRenderedCells(row.getVisibleCells()).map((cell) => cell.column.id)
}
