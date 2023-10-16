import { ActivityApiResponse } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getScalingFactor } from './getScalingFactor'

const ONE_TPS = 24 * 60 * 60

describe(getScalingFactor.name, () => {
  it('calculates correctly', () => {
    const apiResponse: ActivityApiResponse = {
      combined: {
        daily: {
          types: ['timestamp', 'transactions', 'ethereumTransactions'],
          data: [
            [0, ONE_TPS, ONE_TPS],
            [1, ONE_TPS, ONE_TPS],
            [2, ONE_TPS, ONE_TPS],
            [3, ONE_TPS, ONE_TPS],
            [4, ONE_TPS, ONE_TPS],
            [5, ONE_TPS, ONE_TPS],
            [6, ONE_TPS, ONE_TPS],
            [7, ONE_TPS, ONE_TPS],
          ],
        },
      },
      projects: {},
    }

    const result = getScalingFactor(apiResponse)

    expect(result).toEqual('2.00x')
  })
})
