import { expect } from 'earl'
import { getLatestAtOrBefore } from './getEthStakedAt'

describe(getLatestAtOrBefore.name, () => {
  it('takes the latest point at or before each timestamp, within the max age', () => {
    const points = [
      { timestamp: 100, value: 1 },
      { timestamp: 200, value: 2 },
    ]

    expect(
      getLatestAtOrBefore([50, 100, 150, 200, 250, 260], points, 50),
    ).toEqual([null, 1, 1, 2, 2, null])
  })
})
