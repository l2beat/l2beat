import { L2CostsApiChartPoint, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import range from 'lodash/range'

import { getCostsSum } from './getCostsSum'

const now = UnixTime.now()
const data: L2CostsApiChartPoint[] = range(180).map(() => {
  return [now, 10, 10, 10, 1, 1, 1, 5, 5, 5, 3, 3, 3, 1, 1, 1]
})

describe('getCostsSum', () => {
  const testCases = [
    { type: 'totalGas', days: 1, expected: 10 },
    { type: 'totalEth', days: 2, expected: 20 },
    { type: 'totalUsd', days: 5, expected: 50 },
    { type: 'calldataUsd', days: 7, expected: 35 },
    { type: 'overheadGas', days: 30, expected: 30 },
    { type: 'computeEth', days: 180, expected: 540 },
    { type: 'calldataGas', days: Infinity, expected: 900 },
  ] as const

  for (const { type, days, expected } of testCases) {
    it(`should sum the values for ${type} and ${days} days`, () => {
      expect(getCostsSum(data, type, days)).toEqual(expected)
    })
  }

  it('should throw an error if days is less than 1', () => {
    expect(() => getCostsSum(data, 'totalGas', 0)).toThrow(
      'Days must be at least 1',
    )
  })
})
