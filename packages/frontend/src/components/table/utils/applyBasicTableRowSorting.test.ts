import type { Row } from '@tanstack/react-table'
import { expect } from 'earl'
import { applyBasicTableRowSorting } from './applyBasicTableRowSorting'

describe(applyBasicTableRowSorting.name, () => {
  it('sorts rows in place using custom function', () => {
    const rows = [3, 1, 2].map((value) => ({
      original: { value },
    })) as Row<{ value: number }>[]

    const result = applyBasicTableRowSorting(rows, (a, b) => {
      return a.original.value - b.original.value
    })

    expect(result.map((row) => row.original.value)).toEqual([1, 2, 3])
    expect(rows.map((row) => row.original.value)).toEqual([1, 2, 3])
  })

  it('returns rows unchanged when custom sorter is not provided', () => {
    const rows = [3, 1, 2].map((value) => ({
      original: { value },
    })) as Row<{ value: number }>[]

    const result = applyBasicTableRowSorting(rows, undefined)

    expect(result.map((row) => row.original.value)).toEqual([3, 1, 2])
  })
})
