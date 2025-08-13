import indexOf from 'lodash/indexOf'
import max from 'lodash/max'
import sum from 'lodash/sum'

export function unifyPercentagesAsIntegers<T extends number[]>(
  percentages: T,
): T {
  if (percentages.length < 2) {
    throw new Error('Array has to contain at least two elements')
  }

  const ALLOWED_ERROR = 0.001
  const summed = sum(percentages)
  if (summed < 100 - ALLOWED_ERROR || summed > 100 + ALLOWED_ERROR) {
    throw new Error(`Values do not sum to 100, they sum to ${summed}`)
  }

  const intParts = percentages.map(Math.floor)
  const decimalParts = percentages.map((v) => v - Math.floor(v))

  const iterations = 100 - sum(intParts)
  for (let i = 0; i < iterations; i++) {
    const maxDecimal = max(decimalParts)
    if (maxDecimal === undefined) {
      break
    }
    const largestIndex = indexOf(decimalParts, maxDecimal)
    if (largestIndex === -1) {
      break
    }
    intParts[largestIndex] += 1
    decimalParts[largestIndex] = 0
  }

  return intParts as T
}
