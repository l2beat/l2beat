import { describe, expect, it } from 'vitest'
import { getBasicTableRowSpanDenominator } from './getBasicTableRowSpanDenominator'

describe(getBasicTableRowSpanDenominator.name, () => {
  it('returns denominator when row configuration is valid', () => {
    expect(getBasicTableRowSpanDenominator([1, 3])).toBe(3)
    expect(getBasicTableRowSpanDenominator([1, 2, 4])).toBe(4)
  })

  it('throws for invalid row configuration', () => {
    expect(() => getBasicTableRowSpanDenominator([2, 3])).toThrow(
      'Incorrect row configuration',
    )
  })
})
