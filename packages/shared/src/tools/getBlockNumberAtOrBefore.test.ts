import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getBlockNumberAtOrBefore } from './getBlockNumberAtOrBefore'

describe(getBlockNumberAtOrBefore.name, () => {
  it('works properly', async () => {
    const result = await getBlockNumberAtOrBefore(
      UnixTime(69420),
      0,
      100000,
      fakeGetBlock,
    )

    expect(result).toEqual(34710)
  })

  it('finds before when at not available', async () => {
    const result = await getBlockNumberAtOrBefore(
      UnixTime(4275),
      0,
      100000,
      fakeGetBlock,
    )

    expect(result).toEqual(2137)
  })

  it('includes end as a possible result', async () => {
    const result = await getBlockNumberAtOrBefore(
      UnixTime(110000),
      0,
      100000,
      async (n: number) => ({ timestamp: Math.floor(n / 2) }),
    )

    expect(result).toEqual(100000)
  })
})

const fakeGetBlock = async (number: number) => ({
  timestamp: number * 2,
})
