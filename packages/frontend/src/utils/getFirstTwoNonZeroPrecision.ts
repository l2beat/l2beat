import { assert } from '@l2beat/shared-pure'

export function getFirstTwoNonZeroPrecision(value: number, maxPrecision = 32) {
  assert(value < 1, 'Value must be less than 1')
  assert(
    maxPrecision >= 0 && maxPrecision <= 100,
    'Precision must be between 0 and 100',
  )

  const precision = 1 - Math.floor(Math.log(Math.abs(value)) / Math.log(10))

  return Math.min(precision, maxPrecision)
}
