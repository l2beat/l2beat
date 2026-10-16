import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { findCarriedFrom } from './getCarriedFrom'

describe(findCarriedFrom.name, () => {
  const snapshot = UnixTime(1000)

  it('returns undefined when every lane is fresh', () => {
    expect(findCarriedFrom([lane('ethereum', 'base')], {})).toEqual(undefined)
  })

  it('returns the oldest snapshot a carried lane was computed in', () => {
    const transfers = [
      lane('ethereum', 'base', { carriedFrom: UnixTime(900) }),
      lane('ethereum', 'arbitrum', { carriedFrom: UnixTime(800) }),
      lane('ethereum', 'optimism'),
    ]

    expect(findCarriedFrom(transfers, {})).toEqual(UnixTime(800))
  })

  it('ignores carried lanes that do not touch the anchor chain', () => {
    const transfers = [
      lane('ethereum', 'base', { carriedFrom: UnixTime(900) }),
      lane('arbitrum', 'optimism'),
    ]

    expect(findCarriedFrom(transfers, { anchorChain: 'arbitrum' })).toEqual(
      undefined,
    )
    expect(findCarriedFrom(transfers, { anchorChain: 'base' })).toEqual(
      UnixTime(900),
    )
  })

  it('for a token, only counts carried lanes that token moved on', () => {
    const transfers = [
      lane('ethereum', 'base', { carriedFrom: UnixTime(900) }),
      lane('ethereum', 'arbitrum', { carriedFrom: UnixTime(800) }),
    ]
    const tokens = [token('ethereum', 'base', 'usdc')]

    expect(findCarriedFrom(transfers, { tokenId: 'usdc', tokens })).toEqual(
      UnixTime(900),
    )
    expect(findCarriedFrom(transfers, { tokenId: 'eth', tokens })).toEqual(
      undefined,
    )
  })

  function lane(
    srcChain: string,
    dstChain: string,
    overrides: Partial<AggregatedInteropTransferRecord> = {},
  ): AggregatedInteropTransferRecord {
    return {
      timestamp: snapshot,
      id: 'p',
      bridgeType: 'nonMinting',
      srcChain,
      dstChain,
      transferTypeStats: undefined,
      transferCount: 1,
      transfersWithDurationCount: 1,
      identifiedCount: 1,
      totalDurationSum: 0,
      srcValueUsd: undefined,
      dstValueUsd: undefined,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      avgValueInFlight: undefined,
      mintedValueUsd: undefined,
      burnedValueUsd: undefined,
      countUnder100: 0,
      count100To1K: 0,
      count1KTo10K: 0,
      count10KTo100K: 0,
      countOver100K: 0,
      ...overrides,
    }
  }

  function token(
    srcChain: string,
    dstChain: string,
    abstractTokenId: string,
  ): AggregatedInteropTokenRecord {
    return {
      timestamp: snapshot,
      id: 'p',
      bridgeType: 'nonMinting',
      srcChain,
      dstChain,
      abstractTokenId,
      transferTypeStats: undefined,
      transferCount: 1,
      transfersWithDurationCount: 1,
      totalDurationSum: 0,
      volume: 0,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      mintedValueUsd: undefined,
      burnedValueUsd: undefined,
    }
  }
})
