import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { getBlockAtOrBefore } from '../../src/peripherals/getBlockAtOrBefore'

describe(getBlockAtOrBefore.name, () => {
  it('works properly', async () => {
    const result = await getBlockAtOrBefore(
      new UnixTime(69420),
      0,
      100000,
      fakeGetBlock,
    )

    expect(result).toEqual({ number: 34710, timestamp: 69420 })
  })

  it('finds before when at not available', async () => {
    const result = await getBlockAtOrBefore(
      new UnixTime(4275),
      0,
      100000,
      fakeGetBlock,
    )

    expect(result).toEqual({ number: 2137, timestamp: 4274 })
  })
})

const fakeGetBlock = async (number: number) => ({
  number: number,
  timestamp: number * 2,
})
