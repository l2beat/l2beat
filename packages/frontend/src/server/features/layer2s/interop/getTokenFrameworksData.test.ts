import type { Project } from '@l2beat/config'
import { assert, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  buildBridgingTypeBreakdown,
  buildChainPaths,
  buildFrameworkEntry,
  buildTopTokens,
  dropCanonicalSideInLockAndMint,
  getUnknownTokenItemsByFramework,
} from './getTokenFrameworksData'
import type { AggregatedInteropTransferWithTokens } from './types'
import type { TokensDetailsMap } from './utils/buildTokensDetailsMap'
import type { ProtocolData } from './utils/getProtocolsDataMap'
import type { TokenFrameworkDefinition } from './utils/tokenFrameworksList'

describe('getTokenFrameworksData helpers', () => {
  describe(dropCanonicalSideInLockAndMint.name, () => {
    it('drops canonical-side tokens from lockAndMint records', () => {
      const result = dropCanonicalSideInLockAndMint([
        record({
          id: 'layerzero',
          bridgeType: 'lockAndMint',
          tokens: [
            token({ abstractTokenId: 'usdt', mintedValueUsd: 0 }),
            token({ abstractTokenId: 'usdt0', mintedValueUsd: 100 }),
          ],
        }),
      ])

      assert(result[0])
      expect(result[0].tokens.map((t) => t.abstractTokenId)).toEqual(['usdt0'])
    })

    it('keeps tokens with burnedValueUsd > 0 (reverse direction)', () => {
      const result = dropCanonicalSideInLockAndMint([
        record({
          id: 'layerzero',
          bridgeType: 'lockAndMint',
          tokens: [
            token({ abstractTokenId: 'usdt', burnedValueUsd: 0 }),
            token({ abstractTokenId: 'usdt0', burnedValueUsd: 50 }),
          ],
        }),
      ])

      assert(result[0])
      expect(result[0].tokens.map((t) => t.abstractTokenId)).toEqual(['usdt0'])
    })

    it('leaves non-lockAndMint records untouched', () => {
      const tokens = [
        token({
          abstractTokenId: 'usdt',
          mintedValueUsd: 0,
          burnedValueUsd: 0,
        }),
        token({ abstractTokenId: 'usdc', mintedValueUsd: 0 }),
      ]
      const result = dropCanonicalSideInLockAndMint([
        record({ id: 'ccip', bridgeType: 'burnAndMint', tokens }),
      ])

      assert(result[0])
      expect(result[0].tokens).toEqual(tokens)
    })
  })

  describe(getUnknownTokenItemsByFramework.name, () => {
    it('aggregates lockAndMint records that have no minted/burned side into an Unknown TopTokenItem per framework', () => {
      const result = getUnknownTokenItemsByFramework([
        record({
          id: 'layerzero',
          bridgeType: 'lockAndMint',
          transferCount: 5,
          srcValueUsd: 100,
          dstValueUsd: 100,
          tokens: [token({ abstractTokenId: 'usdt' })],
        }),
        record({
          id: 'layerzero',
          bridgeType: 'lockAndMint',
          transferCount: 3,
          srcValueUsd: 40,
          dstValueUsd: 40,
          tokens: [token({ abstractTokenId: 'usdc' })],
        }),
      ])

      const item = result.get('oft')
      expect(item?.symbol).toEqual('Unknown')
      expect(item?.frameworkId).toEqual('oft')
      expect(item?.isUnknown).toEqual(true)
      expect(item?.volume).toEqual(140)
      expect(item?.transferCount).toEqual(8)
    })

    it('ignores records that have at least one minted/burned token', () => {
      const result = getUnknownTokenItemsByFramework([
        record({
          id: 'layerzero',
          bridgeType: 'lockAndMint',
          transferCount: 5,
          srcValueUsd: 100,
          dstValueUsd: 100,
          tokens: [
            token({ abstractTokenId: 'usdt' }),
            token({ abstractTokenId: 'usdt0', mintedValueUsd: 100 }),
          ],
        }),
      ])

      expect(result.size).toEqual(0)
    })

    it('ignores non-lockAndMint records', () => {
      const result = getUnknownTokenItemsByFramework([
        record({
          id: 'ccip',
          bridgeType: 'burnAndMint',
          transferCount: 5,
          srcValueUsd: 100,
          dstValueUsd: 100,
          tokens: [token({ abstractTokenId: 'usdc' })],
        }),
      ])

      expect(result.size).toEqual(0)
    })

    it('skips records with no volume and no transfers', () => {
      const result = getUnknownTokenItemsByFramework([
        record({
          id: 'layerzero',
          bridgeType: 'lockAndMint',
          transferCount: 0,
          srcValueUsd: 0,
          dstValueUsd: 0,
          tokens: [token({ abstractTokenId: 'usdt' })],
        }),
      ])

      expect(result.size).toEqual(0)
    })
  })

  describe(buildTopTokens.name, () => {
    const tokensDetailsMap: TokensDetailsMap = new Map([
      ['eth', { symbol: 'ETH', iconUrl: '/eth.png', issuer: null }],
      ['usdc', { symbol: 'USDC', iconUrl: '/usdc.png', issuer: null }],
      ['dai', { symbol: 'DAI', iconUrl: '/dai.png', issuer: null }],
    ])

    it('sorts tokens by volume and applies limit', () => {
      const result = buildTopTokens(
        [
          record({
            id: 'layerzero',
            tokens: [
              token({ abstractTokenId: 'usdc', volume: 50 }),
              token({ abstractTokenId: 'eth', volume: 200 }),
              token({ abstractTokenId: 'dai', volume: 10 }),
            ],
          }),
        ],
        tokensDetailsMap,
        2,
      )

      expect(result.map((t) => t.symbol)).toEqual(['ETH', 'USDC'])
    })

    it('maps the token framework via the protocol id of the source record', () => {
      const result = buildTopTokens(
        [
          record({
            id: 'wormhole-ntt',
            tokens: [token({ abstractTokenId: 'eth', volume: 100 })],
          }),
        ],
        tokensDetailsMap,
      )

      expect(result[0]?.frameworkId).toEqual('ntt')
    })

    it('skips tokens missing details metadata', () => {
      const result = buildTopTokens(
        [
          record({
            id: 'layerzero',
            tokens: [
              token({ abstractTokenId: 'unknown', volume: 1000 }),
              token({ abstractTokenId: 'eth', volume: 10 }),
            ],
          }),
        ],
        tokensDetailsMap,
      )

      expect(result.map((t) => t.symbol)).toEqual(['ETH'])
    })

    it('picks the top route by per-flow volume', () => {
      const result = buildTopTokens(
        [
          record({
            id: 'layerzero',
            srcChain: 'a',
            dstChain: 'b',
            tokens: [token({ abstractTokenId: 'eth', volume: 10 })],
          }),
          record({
            id: 'layerzero',
            srcChain: 'c',
            dstChain: 'd',
            tokens: [token({ abstractTokenId: 'eth', volume: 100 })],
          }),
        ],
        tokensDetailsMap,
      )

      expect(result[0]?.topRoute?.src.id).toEqual('c')
      expect(result[0]?.topRoute?.dst.id).toEqual('d')
    })
  })

  describe(buildChainPaths.name, () => {
    it('aggregates volume and transfer counts per src->dst pair', () => {
      const result = buildChainPaths([
        record({
          srcChain: 'a',
          dstChain: 'b',
          transferCount: 5,
          srcValueUsd: 100,
          dstValueUsd: 90,
        }),
        record({
          srcChain: 'a',
          dstChain: 'b',
          transferCount: 3,
          srcValueUsd: 40,
          dstValueUsd: 50,
        }),
        record({
          srcChain: 'b',
          dstChain: 'a',
          transferCount: 2,
          srcValueUsd: 20,
          dstValueUsd: 25,
        }),
      ])

      expect(result).toEqual([
        {
          src: { id: 'a', iconUrl: undefined },
          dst: { id: 'b', iconUrl: undefined },
          volume: 150,
          transferCount: 8,
        },
        {
          src: { id: 'b', iconUrl: undefined },
          dst: { id: 'a', iconUrl: undefined },
          volume: 25,
          transferCount: 2,
        },
      ])
    })

    it('sorts the resulting paths by volume descending', () => {
      const result = buildChainPaths([
        record({
          srcChain: 'a',
          dstChain: 'b',
          srcValueUsd: 10,
          dstValueUsd: 10,
        }),
        record({
          srcChain: 'c',
          dstChain: 'd',
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
      ])

      expect(result.map((p) => `${p.src.id}-${p.dst.id}`)).toEqual([
        'c-d',
        'a-b',
      ])
    })
  })

  describe(buildBridgingTypeBreakdown.name, () => {
    it('aggregates volume and transfer counts per bridge type', () => {
      const result = buildBridgingTypeBreakdown([
        record({
          bridgeType: 'lockAndMint',
          transferCount: 5,
          srcValueUsd: 100,
          dstValueUsd: 100,
        }),
        record({
          bridgeType: 'lockAndMint',
          transferCount: 2,
          srcValueUsd: 50,
          dstValueUsd: 50,
        }),
        record({
          bridgeType: 'burnAndMint',
          transferCount: 3,
          srcValueUsd: 30,
          dstValueUsd: 30,
        }),
      ])

      expect(result).toEqual([
        { type: 'lockAndMint', volume: 150, transferCount: 7 },
        { type: 'burnAndMint', volume: 30, transferCount: 3 },
      ])
    })
  })

  describe(buildFrameworkEntry.name, () => {
    const framework: TokenFrameworkDefinition = {
      id: 'oft',
      label: 'OFT',
      projectId: ProjectId('layerzero'),
      color: '#7B61FF',
    }

    it('returns a zeroed entry when protocol data is missing', () => {
      const result = buildFrameworkEntry(framework, undefined, undefined, {
        volume: 100,
        transferCount: 5,
      })

      expect(result).toEqual({
        id: 'oft',
        volume: 0,
        transferCount: 0,
        previousVolume: 100,
        previousTransferCount: 5,
        averageDurationSeconds: null,
        averageValue: null,
      })
    })

    it('computes averageValue from identifiedTransferCount and the average duration from the duration sum', () => {
      const data = protocolData({
        volume: 1000,
        transferCount: 20,
        identifiedTransferCount: 10,
        transfersWithDurationCount: 4,
        totalDurationSum: 1000,
      })

      const result = buildFrameworkEntry(framework, data, undefined, undefined)

      expect(result.volume).toEqual(1000)
      expect(result.transferCount).toEqual(20)
      expect(result.averageValue).toEqual(100)
      expect(result.averageDurationSeconds).toEqual(250)
      expect(result.previousVolume).toEqual(null)
      expect(result.previousTransferCount).toEqual(null)
    })

    it('returns null averageDurationSeconds when the project marks transfer time as unknown', () => {
      const data = protocolData({
        transfersWithDurationCount: 4,
        totalDurationSum: 1000,
      })
      const project = {
        interopConfig: { transfersTimeMode: 'unknown' },
      } as unknown as Project<'interopConfig'>

      const result = buildFrameworkEntry(framework, data, project, undefined)

      expect(result.averageDurationSeconds).toEqual(null)
    })

    it('returns null averageValue when identifiedTransferCount is zero', () => {
      const data = protocolData({
        volume: 500,
        identifiedTransferCount: 0,
      })

      const result = buildFrameworkEntry(framework, data, undefined, undefined)

      expect(result.averageValue).toEqual(null)
    })
  })
})

function record(
  overrides: Partial<AggregatedInteropTransferWithTokens> & {
    id?: string
    bridgeType?: AggregatedInteropTransferWithTokens['bridgeType']
    srcChain?: string
    dstChain?: string
    tokens?: AggregatedInteropTransferWithTokens['tokens']
  },
): AggregatedInteropTransferWithTokens {
  return {
    id: overrides.id ?? 'layerzero',
    bridgeType: overrides.bridgeType ?? 'lockAndMint',
    srcChain: overrides.srcChain ?? 'src',
    dstChain: overrides.dstChain ?? 'dst',
    tokens: overrides.tokens ?? [],
    transferCount: 0,
    transfersWithDurationCount: 0,
    identifiedCount: 0,
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
    transferTypeStats: undefined,
    ...overrides,
  } as AggregatedInteropTransferWithTokens
}

function token(
  overrides: Partial<AggregatedInteropTransferWithTokens['tokens'][number]> & {
    abstractTokenId: string
  },
): AggregatedInteropTransferWithTokens['tokens'][number] {
  return {
    volume: 0,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    transferTypeStats: undefined,
    ...overrides,
  } as AggregatedInteropTransferWithTokens['tokens'][number]
}

function protocolData(overrides: Partial<ProtocolData>): ProtocolData {
  return {
    volume: 0,
    transferCount: 0,
    transfersWithDurationCount: 0,
    totalDurationSum: 0,
    transferTypeStats: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    averageValueInFlight: undefined,
    identifiedTransferCount: 0,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    tokens: new Map(),
    chains: new Map(),
    ...overrides,
  }
}
