import { createColumnHelper } from '@tanstack/react-table'
import { expect } from 'earl'
import {
  getChangeSortColumnVisibility,
  withChangeSort,
} from './changeSortColumn'

interface Row {
  value: number
  change: number
}

const columnHelper = createColumnHelper<Row>()

describe(getChangeSortColumnVisibility.name, () => {
  it('hides change-sort columns including those nested in groups', () => {
    const columns = [
      ...withChangeSort(
        columnHelper,
        columnHelper.accessor('value', {
          id: 'value',
          header: 'Value',
        }),
        {
          getChange: (row) => row.change,
          period: '7D',
        },
      ),
      columnHelper.group({
        id: 'group',
        header: 'Group',
        columns: withChangeSort(
          columnHelper,
          columnHelper.accessor('value', {
            id: 'groupedValue',
            header: 'Grouped',
          }),
          {
            getChange: (row) => row.change,
            period: '7D',
          },
        ),
      }),
    ]

    expect(getChangeSortColumnVisibility(columns)).toEqual({
      valueChange: false,
      groupedValueChange: false,
    })
  })

  it('returns an empty object when no change-sort columns exist', () => {
    const columns = [
      columnHelper.accessor('value', {
        id: 'value',
        header: 'Value',
      }),
    ]

    expect(getChangeSortColumnVisibility(columns)).toEqual({})
  })
})

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
    expect(changeColumn.meta?.isChangeSortColumn).toEqual(true)
  })
})
