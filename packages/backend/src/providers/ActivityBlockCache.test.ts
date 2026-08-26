import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ActivityBlockCache } from './ActivityBlockCache'

describe(ActivityBlockCache.name, () => {
  it('returns stored blocks and undefined for unknown ones', () => {
    const cache = new ActivityBlockCache(4)
    cache.set(block(10, 5))

    expect(cache.get(10)).toEqual(block(10, 5))
    expect(cache.get(11)).toEqual(undefined)
  })

  it('keeps a null uops count', () => {
    const cache = new ActivityBlockCache(4)
    cache.set(block(10, null))

    expect(cache.get(10)).toEqual(block(10, null))
  })

  it('evicts the older block sharing a slot', () => {
    const cache = new ActivityBlockCache(4)
    cache.set(block(1, 1))
    cache.set(block(5, 2))

    expect(cache.get(1)).toEqual(undefined)
    expect(cache.get(5)).toEqual(block(5, 2))
  })

  it('is empty before anything is stored', () => {
    expect(new ActivityBlockCache(4).get(0)).toEqual(undefined)
  })
})

function block(number: number, uopsCount: number | null) {
  return {
    number,
    timestamp: UnixTime(1_700_000_000 + number),
    txsCount: number * 2,
    uopsCount,
  }
}
