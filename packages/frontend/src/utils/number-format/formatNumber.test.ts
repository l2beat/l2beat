import { expect } from 'earl'

import { formatNumber } from './formatNumber'

describe(formatNumber.name, () => {
  describe('default decimals', () => {
    const cases = [
      { value: 0, expected: '0.00' },
      { value: 0.009, expected: '<0.01', negativeExpected: '>-0.01' },
      { value: 0.01, expected: '0.01' },
      { value: 0.19, expected: '0.19' },
      { value: 0.99, expected: '0.99' },
      { value: 1.001, expected: '1.00' },
      { value: 1, expected: '1.00' },
      { value: 1.337, expected: '1.33' },
      { value: 1.331, expected: '1.33' },
      { value: 21.37, expected: '21.37' },
      { value: 99.999, expected: '99.99' },
      { value: 100.999, expected: '100.99' },
      { value: 420.69, expected: '420.69' },
      { value: 999.999, expected: '999.99' },
      { value: 1000, expected: '1.00\u200aK' },
      { value: 1_000.999, expected: '1.00\u200aK' },
      { value: 2_345.67, expected: '2.34\u200aK' },
      { value: 34_567.89, expected: '34.56\u200aK' },
      { value: 99_999.999, expected: '99.99\u200aK' },
      { value: 345_678.91, expected: '345.67\u200aK' },
      { value: 999_999.999, expected: '999.99\u200aK' },
      { value: 1_234_567, expected: '1.23\u200aM' },
      { value: 12_345_678, expected: '12.34\u200aM' },
      { value: 123_456_789, expected: '123.45\u200aM' },
      { value: 1_234_567_891, expected: '1.23\u200aB' },
      { value: 12_345_678_912, expected: '12.34\u200aB' },
      { value: 123_456_789_123, expected: '123.45\u200aB' },
      { value: 1_234_567_891_234, expected: '1.23\u200aT' },
      { value: 12_345_678_912_345, expected: '12.34\u200aT' },
      { value: 123_456_789_123_456, expected: '123.45\u200aT' },
      { value: 1e15, expected: '1000.00\u200aT' },
    ]

    describe('positive', () => {
      for (const { value, expected } of cases) {
        it(`formats ${value} as ${expected}`, () => {
          const result = formatNumber(value)
          expect(result).toEqual(expected)
        })
      }
    })

    describe('negative', () => {
      for (const { value, expected, negativeExpected } of cases) {
        if (value === 0) {
          continue
        }
        it(`formats ${-value} as -${negativeExpected ?? expected}`, () => {
          const result = formatNumber(-value)
          expect(result).toEqual(negativeExpected ?? '-' + expected)
        })
      }
    })
  })

  describe('custom decimals', () => {
    const cases = [
      { value: 0, expected: '0.0000' },
      { value: 0.009, expected: '0.0090' },
      { value: 0.01, expected: '0.0100' },
      { value: 0.19, expected: '0.1900' },
      { value: 0.99, expected: '0.9900' },
      { value: 1, expected: '1.0000' },
      { value: 1.337, expected: '1.3370' },
      { value: 1.331, expected: '1.3310' },
      { value: 21.37, expected: '21.3700' },
      { value: 99.999, expected: '99.9990' },
      { value: 100.999, expected: '100.9990' },
      { value: 420.69, expected: '420.6900' },
      { value: 999.999, expected: '999.9990' },
      { value: 1000, expected: '1.0000\u200aK' },
      { value: 1_000.999, expected: '1.0009\u200aK' },
      { value: 2_345.67, expected: '2.3456\u200aK' },
      { value: 34_567.89, expected: '34.5678\u200aK' },
      { value: 99_999.999, expected: '99.9999\u200aK' },
      { value: 345_678.91, expected: '345.6789\u200aK' },
      { value: 999_999.999, expected: '999.9999\u200aK' },
      { value: 1_234_567, expected: '1.2345\u200aM' },
      { value: 12_345_678, expected: '12.3456\u200aM' },
      { value: 123_456_789, expected: '123.4567\u200aM' },
      { value: 1_234_567_891, expected: '1.2345\u200aB' },
      { value: 12_345_678_912, expected: '12.3456\u200aB' },
      { value: 123_456_789_123, expected: '123.4567\u200aB' },
      { value: 1_234_567_891_234, expected: '1.2345\u200aT' },
      { value: 12_345_678_912_345, expected: '12.3456\u200aT' },
      { value: 123_456_789_123_456, expected: '123.4567\u200aT' },
      { value: 1e15, expected: '1000.0000\u200aT' },
    ]

    describe('positive', () => {
      for (const { value, expected } of cases) {
        it(`formats ${value} as ${expected}`, () => {
          const result = formatNumber(value, 4)
          expect(result).toEqual(expected)
        })
      }
    })

    describe('negative', () => {
      for (const { value, expected } of cases) {
        if (value === 0) {
          continue
        }
        it(`formats ${-value} as -${expected}`, () => {
          const result = formatNumber(-value, 4)
          expect(result).toEqual('-' + expected)
        })
      }
    })
  })
})
