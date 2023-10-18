import { expect } from 'earl'

import { ActivityResponse } from '../../types'
import { getScalingFactor } from './getScalingFactor'

describe(getScalingFactor.name, () => {
  it('calculates correctly', () => {
    const apiResponse: ActivityResponse = {
      daily: {
        types: ['timestamp', 'transactions', 'ethereumTransactions'],
        data: [
          [0, 123, 16549],
          [1, 3, 3],
          [2, 12, 4],
          [3, 2, 1],
          [4, 6, 3],
          [5, 2, 26],
          [6, 1, 1],
          [7, 18, 6],
        ],
      },
    }

    const result = getScalingFactor(apiResponse)

    expect(result).toEqual('2.00x')
  })
})
