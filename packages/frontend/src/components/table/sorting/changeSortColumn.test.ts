import {
  createColumnHelper,
  createTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
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

    expect(valueColumn.meta?.changeSortColumnId).toStrictEqual('totalChange')
    expect(valueColumn.meta?.align).toStrictEqual('right')
    expect(changeColumn.id).toStrictEqual('totalChange')
    expect(typeof changeColumn.header).toStrictEqual('function')
    expect(changeColumn.enableHiding).toStrictEqual(false)
    expect(changeColumn.meta?.isChangeSortColumn).toStrictEqual(true)
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
    expect(typeof header).toStrictEqual('function')
    if (typeof header !== 'function') {
      throw new Error('expected a header function')
    }
    expect(header({ table } as never)).toStrictEqual('7D%')
  })
})
