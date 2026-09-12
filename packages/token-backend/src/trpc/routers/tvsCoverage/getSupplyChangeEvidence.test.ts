import type {
  AbstractTokenRecord,
  Database,
  DeployedTokenRecord,
  TokenDatabase,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  evictExpiredCacheEntries,
  getSupplyChangeEvidence,
  supplyChangeWindow,
} from './getSupplyChangeEvidence'

describe(evictExpiredCacheEntries.name, () => {
  it('deletes expired entries and keeps live entries', () => {
    const cache = new Map([
      ['expired', { expiresAt: 100, value: 1 }],
      ['live', { expiresAt: 101, value: 2 }],
    ])

    evictExpiredCacheEntries(cache, 100)

    expect(Array.from(cache.entries())).toEqual([
      ['live', { expiresAt: 101, value: 2 }],
    ])
  })
})

describe(getSupplyChangeEvidence.name, () => {
  it('reconciles retained bridge flows with supply change', async () => {
    const tokenAddress = address(1)
    const now = UnixTime(
      8 * UnixTime.DAY + 5 * UnixTime.HOUR + 30 * UnixTime.MINUTE,
    )
    const { from, to } = supplyChangeWindow(now)
    const interopTransfer = mockObject<Database['interopTransfer']>({
      getSupplyChangeStatsByRange: mockFn().resolvesTo([
        {
          chain: 'chain-a',
          address: tokenAddress,
          mintedRaw: '6000000',
          burnedRaw: '1000000',
          transferCount: 3,
          missingAmountCount: 0,
        },
      ]),
    })
    const tvsBlockTimestamp = mockObject<Database['tvsBlockTimestamp']>({
      findBlockNumberByChainAndTimestamp: mockFn().executes(
        async (_chain: string, timestamp: UnixTime) =>
          timestamp === from ? 100 : 200,
      ),
    })
    const deployedToken = mockObject<TokenDatabase['deployedToken']>({
      getByChainAndAddress: mockFn().resolvesTo([
        token('chain-a', tokenAddress, 6, UnixTime(1)),
      ]),
    })
    const chain = mockObject<TokenDatabase['chain']>({
      getAll: mockFn().resolvesTo([
        {
          name: 'chain-a',
          chainId: 1,
          explorerUrl: null,
          aliases: null,
          apis: [{ type: 'rpc', url: 'https://rpc.example' }],
        },
      ]),
    })
    const reads: number[] = []

    const result = await getSupplyChangeEvidence(
      mockObject<Database>({ interopTransfer, tvsBlockTimestamp }),
      mockObject<TokenDatabase>({ deployedToken, chain }),
      [{ chain: 'chain-a', address: tokenAddress }],
      {
        now,
        readTotalSupplyAt: async ({ blockNumber }) => {
          reads.push(blockNumber)
          return BigInt(blockNumber === 100 ? 100_000_000 : 105_000_000)
        },
      },
    )

    expect(result).toEqual([
      {
        chain: 'chain-a',
        address: tokenAddress,
        from,
        to,
        supplyStart: '100',
        supplyEnd: '105',
        supplyChange: '5',
        interopMinted: '6',
        interopBurned: '1',
        interopNet: '5',
        unexplainedChange: '0',
        bridgeShareOfSupplyChange: 100,
        transferCount: 3,
      },
    ])
    expect(reads).toEqualUnsorted([100, 200])
    expect(interopTransfer.getSupplyChangeStatsByRange).toHaveBeenCalledWith(
      [{ chain: 'chain-a', address: tokenAddress }],
      from,
      to,
    )
  })

  it('uses zero starting supply when the token was deployed in the window', async () => {
    const tokenAddress = address(1)
    const now = UnixTime(10 * UnixTime.DAY)
    const { from } = supplyChangeWindow(now)
    const readTotalSupplyAt = mockFn().resolvesTo(2n * 10n ** 18n)
    const interopTransfer = mockObject<Database['interopTransfer']>({
      getSupplyChangeStatsByRange: mockFn().resolvesTo([
        {
          chain: 'chain-a',
          address: tokenAddress,
          mintedRaw: (2n * 10n ** 18n).toString(),
          burnedRaw: '0',
          transferCount: 1,
          missingAmountCount: 0,
        },
      ]),
    })
    const tvsBlockTimestamp = mockObject<Database['tvsBlockTimestamp']>({
      findBlockNumberByChainAndTimestamp: mockFn().executes(
        async (_chain: string, timestamp: UnixTime) =>
          timestamp === from ? undefined : 200,
      ),
    })
    const deployedToken = mockObject<TokenDatabase['deployedToken']>({
      getByChainAndAddress: mockFn().resolvesTo([
        token('chain-a', tokenAddress, 18, UnixTime(from + 1)),
      ]),
    })
    const chain = mockObject<TokenDatabase['chain']>({
      getAll: mockFn().resolvesTo([
        {
          name: 'chain-a',
          chainId: 1,
          explorerUrl: null,
          aliases: null,
          apis: [{ type: 'rpc', url: 'https://rpc.example' }],
        },
      ]),
    })

    const result = await getSupplyChangeEvidence(
      mockObject<Database>({ interopTransfer, tvsBlockTimestamp }),
      mockObject<TokenDatabase>({ deployedToken, chain }),
      [{ chain: 'chain-a', address: tokenAddress }],
      { now, readTotalSupplyAt },
    )

    expect(result[0]?.supplyStart).toEqual('0')
    expect(result[0]?.supplyEnd).toEqual('2')
    expect(result[0]?.bridgeShareOfSupplyChange).toEqual(100)
    expect(readTotalSupplyAt).toHaveBeenCalledTimes(1)
  })
})

function token(
  chain: string,
  tokenAddress: string,
  decimals: number,
  deploymentTimestamp: UnixTime,
): {
  deployedToken: DeployedTokenRecord
  abstractToken: AbstractTokenRecord
} {
  return {
    deployedToken: {
      chain,
      address: tokenAddress,
      abstractTokenId: 'TOKEN',
      symbol: 'TKN',
      decimals,
      deploymentTimestamp,
      comment: null,
      metadata: null,
      ignored: false,
    },
    abstractToken: {
      id: 'TOKEN',
      symbol: 'TKN',
      coingeckoId: null,
      issuer: null,
      category: 'other',
      iconUrl: null,
      coingeckoListingTimestamp: null,
      additionalCoingeckoEntries: null,
      comment: null,
      reviewed: true,
      isPriceUnreliable: false,
    },
  }
}

function address(value: number): string {
  return `0x${value.toString(16).padStart(40, '0')}`
}
