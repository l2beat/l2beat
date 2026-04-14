import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { AggregatedInteropTransferWithTokens } from '../types'
import { getInteropFlowAggregates } from './getInteropFlowAggregates'

describe(getInteropFlowAggregates.name, () => {
  it('aggregates flows and top tokens by chain and pair while skipping subgroup projects', () => {
    const result = getInteropFlowAggregates(
      [
        record({
          projectId: 'main',
          srcChain: 'chain-a',
          dstChain: 'chain-b',
          transferCount: 2,
          srcValueUsd: 100,
          dstValueUsd: 90,
          tokens: [
            { id: 'eth', volume: 10 },
            { id: 'usdc', volume: 5 },
          ],
        }),
        record({
          projectId: 'main',
          srcChain: 'chain-b',
          dstChain: 'chain-a',
          transferCount: 3,
          srcValueUsd: 45,
          dstValueUsd: 50,
          tokens: [
            { id: 'eth', volume: 20 },
            { id: 'usdt', volume: 30 },
          ],
        }),
        record({
          projectId: 'sub',
          srcChain: 'chain-a',
          dstChain: 'chain-b',
          transferCount: 100,
          srcValueUsd: 1_000,
          dstValueUsd: 1_000,
          tokens: [{ id: 'btc', volume: 1_000 }],
        }),
      ],
      new Set([ProjectId('sub')]),
    )

    expect(result.flows).toEqual([
      {
        srcChain: 'chain-a',
        dstChain: 'chain-b',
        volume: 100,
        transferCount: 2,
      },
      {
        srcChain: 'chain-b',
        dstChain: 'chain-a',
        volume: 50,
        transferCount: 3,
      },
    ])

    expect(result.chainTopTokens.get('chain-a')).toEqual([
      { id: 'eth', volume: 30 },
      { id: 'usdt', volume: 30 },
      { id: 'usdc', volume: 5 },
    ])
    expect(result.chainTopTokens.get('chain-b')).toEqual([
      { id: 'eth', volume: 30 },
      { id: 'usdt', volume: 30 },
      { id: 'usdc', volume: 5 },
    ])
    expect(result.chainPairTopTokens.get('chain-a::chain-b')).toEqual([
      { id: 'eth', volume: 30 },
      { id: 'usdt', volume: 30 },
      { id: 'usdc', volume: 5 },
    ])
    expect(result.topToken).toEqual({ id: 'eth', volume: 30 })
    expect(result.tokenIds.toSorted()).toEqual(['eth', 'usdc', 'usdt'])
  })
})

function record({
  projectId,
  srcChain,
  dstChain,
  transferCount,
  srcValueUsd,
  dstValueUsd,
  tokens,
}: {
  projectId: string
  srcChain: string
  dstChain: string
  transferCount: number
  srcValueUsd: number
  dstValueUsd: number
  tokens: { id: string; volume: number }[]
}): AggregatedInteropTransferWithTokens {
  return {
    id: projectId,
    srcChain,
    dstChain,
    transferCount,
    srcValueUsd,
    dstValueUsd,
    tokens: tokens.map((token) => ({
      abstractTokenId: token.id,
      transferCount: 0,
      totalDurationSum: 0,
      transfersWithDurationCount: 0,
      volume: token.volume,
      minTransferValueUsd: undefined,
      maxTransferValueUsd: undefined,
      mintedValueUsd: undefined,
      burnedValueUsd: undefined,
      transferTypeStats: undefined,
    })),
  } as unknown as AggregatedInteropTransferWithTokens
}
