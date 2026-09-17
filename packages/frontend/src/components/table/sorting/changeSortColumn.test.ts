import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import { expect } from 'earl'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { withChangeSort } from './changeSortColumn'

interface Row {
  value: number
  change: number
  changePeriod: PercentageChangePeriod | undefined
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
      (row) => ({ change: row.change, period: row.changePeriod }),
    )

    expect(valueColumn.meta?.changeSortColumnId).toEqual('totalChange')
    expect(valueColumn.meta?.align).toEqual('right')
    expect(changeColumn.id).toEqual('totalChange')
    expect(typeof changeColumn.header).toEqual('function')
    expect(changeColumn.enableHiding).toEqual(false)
    expect(changeColumn.meta?.isChangeSortColumn).toEqual(true)
  })

  it('derives the header label from row changePeriod', () => {
    const table = createTable({
      data: [{ value: 1, change: 0.1, changePeriod: '7D' }],
      columns: withChangeSort(
        columnHelper,
        columnHelper.accessor('value', {
          id: 'total',
          header: 'Total',
        }),
        (row) => ({ change: row.change, period: row.changePeriod }),
      ),
      getCoreRowModel: getCoreRowModel(),
      renderFallbackValue: null,
      state: {},
      onStateChange: () => {},
    })
    table.setOptions((prev) => ({
      ...prev,
      state: table.initialState,
    }))

    const header = table.getColumn('totalChange')?.columnDef.header
    expect(typeof header).toEqual('function')
    if (typeof header !== 'function') {
      throw new Error('expected a header function')
    }
    expect(header({ table } as never)).toEqual('7D%')
  })
})
