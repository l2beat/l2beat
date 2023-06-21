import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getBlockNumberAtOrBefore } from './getBlockNumberAtOrBefore'

describe(getBlockNumberAtOrBefore.name, () => {
  it('works properly', async () => {
    const result = await getBlockNumberAtOrBefore(
      new UnixTime(69420),
      0,
      100000,
      fakeGetBlock,
    )

    expect(result).toEqual(34710)
  })

  it('finds before when at not available', async () => {
    const result = await getBlockNumberAtOrBefore(
      new UnixTime(4275),
      0,
      100000,
      fakeGetBlock,
    )

    expect(result).toEqual(2137)
  })
})

const fakeGetBlock = async (number: number) => ({
  timestamp: number * 2,
})
