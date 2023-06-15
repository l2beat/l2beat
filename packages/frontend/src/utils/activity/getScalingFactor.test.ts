import { ActivityApiResponse, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getScalingFactor } from './getScalingFactor'

const ONE_TPS = 24 * 60 * 60

describe(getScalingFactor.name, () => {
  it('calculates correctly', () => {
    const apiResponse: ActivityApiResponse = {
      ethereum: {
        types: ['timestamp', 'daily tx count'],
        data: [
          [new UnixTime(0), ONE_TPS],
          [new UnixTime(1), ONE_TPS],
          [new UnixTime(2), ONE_TPS],
          [new UnixTime(3), ONE_TPS],
          [new UnixTime(4), ONE_TPS],
          [new UnixTime(5), ONE_TPS],
          [new UnixTime(6), ONE_TPS],
          [new UnixTime(7), ONE_TPS],
        ],
      },
      combined: {
        types: ['timestamp', 'daily tx count'],
        data: [
          [new UnixTime(0), ONE_TPS],
          [new UnixTime(1), ONE_TPS],
          [new UnixTime(2), ONE_TPS],
          [new UnixTime(3), ONE_TPS],
          [new UnixTime(4), ONE_TPS],
          [new UnixTime(5), ONE_TPS],
          [new UnixTime(6), ONE_TPS],
          [new UnixTime(7), ONE_TPS],
        ],
      },
      projects: {},
    }

    const result = getScalingFactor(apiResponse)

    expect(result).toEqual('2.00x')
  })
})
