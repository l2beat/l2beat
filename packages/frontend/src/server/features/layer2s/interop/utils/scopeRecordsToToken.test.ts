import { expect } from 'earl'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { scopeRecordsToToken } from './scopeRecordsToToken'

describe(scopeRecordsToToken.name, () => {
  it('returns token-scoped records with a single volume field', () => {
    const [result] = scopeRecordsToToken(
      [
        record({
          tokens: [
            token({ abstractTokenId: 'eth', volume: 100, transferCount: 2 }),
            token({ abstractTokenId: 'usdc', volume: 50, transferCount: 1 }),
          ],
        }),
      ],
      'eth',
    )

    if (!result) throw new Error('Expected scoped record')

    expect(result.volume).toEqual(100)
    expect(result.transferCount).toEqual(2)
    expect(result.identifiedCount).toEqual(2)
    expect(result.tokens.map((token) => token.abstractTokenId)).toEqual(['eth'])
    expect('srcValueUsd' in result).toEqual(false)
    expect('dstValueUsd' in result).toEqual(false)
  })

  it('asserts when one aggregate has duplicate token rows', () => {
    expect(() =>
      scopeRecordsToToken(
        [
          record({
            tokens: [
              token({ abstractTokenId: 'eth', volume: 100, transferCount: 2 }),
              token({ abstractTokenId: 'eth', volume: 50, transferCount: 1 }),
            ],
          }),
        ],
        'eth',
      ),
    ).toThrow(/Expected exactly one token row for eth/)
  })
})

function record({
  tokens,
}: {
  tokens: AggregatedInteropTransferWithTokens['tokens']
}): AggregatedInteropTransferWithTokens {
  return {
    id: 'protocol',
    timestamp: 0,
    srcChain: 'ethereum',
    dstChain: 'arbitrum',
    bridgeType: 'lockAndMint',
    srcValueUsd: 150,
    dstValueUsd: 140,
    transferCount: 3,
    transfersWithDurationCount: 3,
    totalDurationSum: 30,
    transferTypeStats: undefined,
    identifiedCount: 3,
    avgValueInFlight: undefined,
    minTransferValueUsd: 10,
    maxTransferValueUsd: 100,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    tokens,
  }
}

function token(
  overrides: Partial<AggregatedInteropTransferWithTokens['tokens'][number]> & {
    abstractTokenId: string
    volume: number
    transferCount: number
  },
): AggregatedInteropTransferWithTokens['tokens'][number] {
  return {
    abstractTokenId: overrides.abstractTokenId,
    volume: overrides.volume,
    transferCount: overrides.transferCount,
    transfersWithDurationCount: overrides.transfersWithDurationCount ?? 0,
    totalDurationSum: overrides.totalDurationSum ?? 0,
    transferTypeStats: overrides.transferTypeStats,
    minTransferValueUsd: overrides.minTransferValueUsd,
    maxTransferValueUsd: overrides.maxTransferValueUsd,
    mintedValueUsd: overrides.mintedValueUsd,
    burnedValueUsd: overrides.burnedValueUsd,
  }
}
