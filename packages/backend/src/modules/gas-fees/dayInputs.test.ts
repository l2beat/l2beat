import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { getDayBlocks } from './dayInputs'

describe(getDayBlocks.name, () => {
  const day = UnixTime.fromDate(new Date('2026-11-10T00:00:00Z'))
  // A block every 12 s, numbered by its slot since the start of the day before
  const blockAt = (t: UnixTime, newest = Number.POSITIVE_INFINITY) =>
    Math.min(newest, Math.floor((t - day + UnixTime.DAY) / 12))

  it('gives the first and last block of the day', async () => {
    const finder = { getBlockNumberAtOrBefore: mockFn(async (t) => blockAt(t)) }

    expect(await getDayBlocks(finder, day)).toEqual({
      firstBlock: 7201,
      lastBlock: 14_400,
    })
  })

  it('fails when the finder has no block past the day, as it would cut the day short', async () => {
    // Its newest block is an hour before the day ends
    const finder = {
      getBlockNumberAtOrBefore: mockFn(async (t) => blockAt(t, 14_100)),
    }

    await expect(getDayBlocks(finder, day)).toBeRejectedWith(
      'Block finder has no block past the day',
    )
  })
})
