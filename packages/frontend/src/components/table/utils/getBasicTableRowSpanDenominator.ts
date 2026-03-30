import { assert } from '@l2beat/shared-pure'

export function getBasicTableRowSpanDenominator(rowCounts: number[]): number {
  const denominator = commonDenominator(rowCounts)
  const maxRowSpan = Math.max(...rowCounts)
  assert(denominator === maxRowSpan, 'Incorrect row configuration')
  return denominator
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b)
}

function leastCommonMultiple(a: number, b: number): number {
  return (a * b) / greatestCommonDivisor(a, b)
}

function commonDenominator(numbers: number[]): number {
  return numbers.reduce((acc, num) => leastCommonMultiple(acc, num))
}
