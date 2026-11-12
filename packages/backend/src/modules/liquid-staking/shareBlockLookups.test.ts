import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import { shareBlockLookups } from './shareBlockLookups'

describe(shareBlockLookups.name, () => {
  it('looks a timestamp up once for every caller', async () => {
    const lookup = mockFn().resolvesTo(100)
    const finder = shareBlockLookups({ getBlockNumberAtOrBefore: lookup })

    const blocks = await Promise.all([
      finder.getBlockNumberAtOrBefore(UnixTime(3600)),
      finder.getBlockNumberAtOrBefore(UnixTime(3600)),
    ])

    expect(blocks).toEqual([100, 100])
    expect(lookup).toHaveBeenCalledTimes(1)
  })

  it('asks again after a failed lookup', async () => {
    const lookup = mockFn()
      .rejectsWithOnce(new Error('RPC down'))
      .resolvesTo(100)
    const finder = shareBlockLookups({ getBlockNumberAtOrBefore: lookup })

    await expect(
      finder.getBlockNumberAtOrBefore(UnixTime(3600)),
    ).toBeRejectedWith('RPC down')
    expect(await finder.getBlockNumberAtOrBefore(UnixTime(3600))).toEqual(100)
    expect(lookup).toHaveBeenCalledTimes(2)
  })
})
