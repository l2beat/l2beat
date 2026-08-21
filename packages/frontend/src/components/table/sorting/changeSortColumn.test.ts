import { createColumnHelper } from '@tanstack/react-table'
import { expect } from 'earl'
import { withChangeSort } from './changeSortColumn'

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
