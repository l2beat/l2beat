import { assert } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import { expect } from 'earl'
import { getBasicTableGroupParams } from '../utils/getBasicTableGroupParams'
import { getChangeSortAwareColSpan, withChangeSort } from './changeSortColumn'

interface Row {
  value: number
  change: number
}

const columnHelper = createColumnHelper<Row>()

describe(withChangeSort.name, () => {
  it('wires the value column to a companion change column', () => {
    const [valueColumn, changeColumn] = withChangeSort(
      columnHelper,
      columnHelper.accessor('value', {
        id: 'total',
        header: 'Total',
        meta: { align: 'right' },
      }),
      {
        getChange: (row) => row.change,
        period: '7D',
      },
    )

    expect(valueColumn.meta?.changeSortColumnId).toEqual('totalChange')
    expect(valueColumn.meta?.align).toEqual('right')
    expect(changeColumn.id).toEqual('totalChange')
    expect(changeColumn.enableHiding).toEqual(false)
    expect(changeColumn.meta?.isChangeSortColumn).toEqual(true)
  })
})

describe(getChangeSortAwareColSpan.name, () => {
  it('excludes companion columns from layout colSpan', () => {
    const columns = [
      columnHelper.group({
        id: 'data',
        header: 'Data',
        columns: withChangeSort(
          columnHelper,
          columnHelper.accessor('value', {
            id: 'total',
            header: 'Total',
          }),
          {
            getChange: (row) => row.change,
            period: '7D',
          },
        ),
      }),
    ]

    const table = createTable({
      data: [{ value: 1, change: 0.07 }],
      columns,
      getCoreRowModel: getCoreRowModel(),
      renderFallbackValue: null,
      state: {},
      onStateChange: () => {},
    })
    table.setOptions((prev) => ({
      ...prev,
      state: table.initialState,
    }))

    const groupHeader = table.getHeaderGroups()[0]?.headers[0]
    assert(groupHeader, 'expected a grouped header')
    const totalColumn = table.getColumn('total')
    assert(totalColumn, 'expected a total column')

    expect(groupHeader.colSpan).toEqual(2)
    expect(getChangeSortAwareColSpan(groupHeader)).toEqual(1)
    expect(getBasicTableGroupParams(totalColumn)).toEqual({
      headerTitle: 'Data',
      isFirstInGroup: true,
      isLastInGroup: true,
    })
  })
})
