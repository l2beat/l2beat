import type { HeaderGroup, Row } from '@tanstack/react-table'
import { expect } from 'earl'
import { applyBasicTableRowSorting } from './utils/applyBasicTableRowSorting'
import { getBasicTableAdditionalRowIndex } from './utils/getBasicTableAdditionalRowIndex'
import { getBasicTableHeaderSections } from './utils/getBasicTableHeaderSections'
import { getBasicTableRowSpanDenominator } from './utils/getBasicTableRowSpanDenominator'

describe('table utils', () => {
  describe(getBasicTableHeaderSections.name, () => {
    it('returns only actual header for one-level headers', () => {
      const header = { id: 'h0' } as HeaderGroup<unknown>

      const result = getBasicTableHeaderSections([header])

      expect(result.groupedHeader).toEqual(undefined)
      expect(result.actualHeader).toEqual(header)
    })

    it('returns grouped and actual headers for two-level headers', () => {
      const groupedHeader = { id: 'h0' } as HeaderGroup<unknown>
      const actualHeader = { id: 'h1' } as HeaderGroup<unknown>

      const result = getBasicTableHeaderSections([groupedHeader, actualHeader])

      expect(result.groupedHeader).toEqual(groupedHeader)
      expect(result.actualHeader).toEqual(actualHeader)
    })

    it('throws for more than one grouping level', () => {
      const headerGroups = [
        { id: 'h0' },
        { id: 'h1' },
        { id: 'h2' },
      ] as HeaderGroup<unknown>[]

      expect(() => getBasicTableHeaderSections(headerGroups)).toThrow(
        'Only 1 level of headers is supported',
      )
    })
  })

  describe(getBasicTableRowSpanDenominator.name, () => {
    it('returns denominator when row configuration is valid', () => {
      expect(getBasicTableRowSpanDenominator([1, 3])).toEqual(3)
      expect(getBasicTableRowSpanDenominator([1, 2, 4])).toEqual(4)
    })

    it('throws for invalid row configuration', () => {
      expect(() => getBasicTableRowSpanDenominator([2, 3])).toThrow(
        'Incorrect row configuration',
      )
    })
  })

  describe(getBasicTableAdditionalRowIndex.name, () => {
    it('returns index only for matching additional row slots', () => {
      expect(getBasicTableAdditionalRowIndex(0, 2)).toEqual(undefined)
      expect(getBasicTableAdditionalRowIndex(1, 2)).toEqual(0)
      expect(getBasicTableAdditionalRowIndex(3, 2)).toEqual(1)
    })

    it('returns consecutive indexes when row span is 1', () => {
      expect(getBasicTableAdditionalRowIndex(0, 1)).toEqual(0)
      expect(getBasicTableAdditionalRowIndex(1, 1)).toEqual(1)
    })
  })

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
})
