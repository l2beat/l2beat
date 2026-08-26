import type { Block } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { UopsAnalyzer } from '../modules/activity/services/uops/types'
import {
  ActivityBlockCache,
  ActivityBlockCacheProcessor,
} from './ActivityBlockCache'

function block(number: number, transactions = 2): Block {
  return {
    number,
    hash: `0x${number}`,
    logsBloom: '0x0',
    timestamp: 1_700_000_000 + number,
    transactions: Array.from({ length: transactions }, () => ({})) as never,
  }
}

describe(ActivityBlockCache.name, () => {
  it('returns nothing for chains that were not enabled', () => {
    const cache = new ActivityBlockCache(10)
    cache.set('ethereum', {
      number: 1,
      timestamp: UnixTime(1),
      txsCount: 1,
      uopsCount: null,
    })
    expect(cache.get('ethereum', 1)).toEqual(undefined)
  })

  it('round-trips a block summary', () => {
    const cache = new ActivityBlockCache(10)
    cache.enable('ethereum')
    cache.set('ethereum', {
      number: 7,
      timestamp: UnixTime(1_700_000_007),
      txsCount: 42,
      uopsCount: 55,
    })

    expect(cache.get('ethereum', 7)).toEqual({
      number: 7,
      timestamp: UnixTime(1_700_000_007),
      txsCount: 42,
      uopsCount: 55,
    })
  })

  it('preserves a null uops count', () => {
    const cache = new ActivityBlockCache(10)
    cache.enable('ethereum')
    cache.set('ethereum', {
      number: 3,
      timestamp: UnixTime(1_700_000_003),
      txsCount: 1,
      uopsCount: null,
    })

    expect(cache.get('ethereum', 3)?.uopsCount).toEqual(null)
  })

  it('drops entries evicted by newer blocks instead of returning stale ones', () => {
    const cache = new ActivityBlockCache(4)
    cache.enable('ethereum')
    for (let number = 1; number <= 8; number++) {
      cache.set('ethereum', {
        number,
        timestamp: UnixTime(1_700_000_000 + number),
        txsCount: number,
        uopsCount: null,
      })
    }

    expect(cache.get('ethereum', 1)).toEqual(undefined)
    expect(cache.get('ethereum', 8)?.txsCount).toEqual(8)
    expect(cache.get('ethereum', 5)?.txsCount).toEqual(5)
  })

  it('keeps chains isolated', () => {
    const cache = new ActivityBlockCache(10)
    cache.enable('ethereum')
    cache.enable('base')
    cache.set('ethereum', {
      number: 1,
      timestamp: UnixTime(1),
      txsCount: 1,
      uopsCount: null,
    })

    expect(cache.get('base', 1)).toEqual(undefined)
  })
})

describe(ActivityBlockCacheProcessor.name, () => {
  it('publishes the summary activity needs', async () => {
    const cache = new ActivityBlockCache(10)
    cache.enable('ethereum')
    const processor = new ActivityBlockCacheProcessor(
      'ethereum',
      cache,
      mockObject<UopsAnalyzer>({ calculateUops: () => 9 }),
    )

    await processor.processBlock(block(5, 3))

    expect(cache.get('ethereum', 5)).toEqual({
      number: 5,
      timestamp: UnixTime(1_700_000_005),
      txsCount: 3,
      uopsCount: 9,
    })
  })

  it('stores a null uops count when the chain has no analyzer', async () => {
    const cache = new ActivityBlockCache(10)
    cache.enable('ethereum')
    const processor = new ActivityBlockCacheProcessor(
      'ethereum',
      cache,
      undefined,
    )

    await processor.processBlock(block(5, 3))

    expect(cache.get('ethereum', 5)?.uopsCount).toEqual(null)
  })
})
