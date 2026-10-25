import type {
  AbstractTokenRecord,
  Database,
  DeployedTokenRecord,
  TokenDatabase,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getSupplyEstimates, SUPPLY_ESTIMATE_LIMIT } from './getSupplyEstimates'

describe(getSupplyEstimates.name, () => {
  it('reads supplies and combines them with current interop prices', async () => {
    const pricedAddress = address(1)
    const unpricedAddress = address(2)
    const vaultAssetAddress = address(3)
    const deployedToken = mockObject<TokenDatabase['deployedToken']>({
      getByChainAndAddress: mockFn().resolvesTo([
        token('chain-a', pricedAddress, 18, 'priced'),
        token('chain-a', unpricedAddress, 6, null),
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
    const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
      getClosestPricesAtOrBefore: mockFn().resolvesTo(new Map([[0, 2]])),
    })
    const reads: string[] = []

    const result = await getSupplyEstimates(
      mockObject<Database>({ interopRecentPrices }),
      mockObject<TokenDatabase>({ deployedToken, chain }),
      [
        { chain: 'chain-a', address: pricedAddress },
        { chain: 'chain-a', address: unpricedAddress },
        { chain: 'solana', address: 'not-an-evm-address' },
        { chain: 'chain-a', address: pricedAddress.toUpperCase() },
      ],
      {
        readTotalSupply: async (request) => {
          reads.push(request.address)
          return request.address === pricedAddress
            ? 100n * 10n ** 18n
            : 50n * 10n ** 6n
        },
        readVaultAsset: async (request) =>
          request.address === pricedAddress
            ? { address: vaultAssetAddress, symbol: 'ASSET' }
            : undefined,
        getCoinsMarketData: async (ids) => {
          expect(ids).toEqual(['priced'])
          return [
            {
              id: 'priced',
              circulating_supply: 25,
              last_updated: '2026-09-03T07:57:20.000Z',
            },
          ]
        },
      },
    )

    expect(result).toEqual([
      {
        chain: 'chain-a',
        address: pricedAddress,
        totalSupply: '100',
        estimatedValueUsd: 50,
        coingeckoCirculatingSupply: 25,
        coingeckoUpdatedAt: '2026-09-03T07:57:20.000Z',
        vaultAsset: {
          address: vaultAssetAddress,
          symbol: 'ASSET',
        },
      },
      {
        chain: 'chain-a',
        address: unpricedAddress,
        totalSupply: '50',
        estimatedValueUsd: undefined,
        coingeckoCirculatingSupply: undefined,
        coingeckoUpdatedAt: undefined,
        vaultAsset: undefined,
      },
      { chain: 'solana', address: 'not-an-evm-address' },
    ])
    expect(reads).toEqual([pricedAddress, unpricedAddress])
  })

  it('uses total supply when it is below global circulating supply', async () => {
    const tokenAddress = address(1)
    const deployedToken = mockObject<TokenDatabase['deployedToken']>({
      getByChainAndAddress: mockFn().resolvesTo([
        token('chain-a', tokenAddress, 18, 'priced'),
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
    const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
      getClosestPricesAtOrBefore: mockFn().resolvesTo(new Map([[0, 2]])),
    })

    const result = await getSupplyEstimates(
      mockObject<Database>({ interopRecentPrices }),
      mockObject<TokenDatabase>({ deployedToken, chain }),
      [{ chain: 'chain-a', address: tokenAddress }],
      {
        readTotalSupply: async () => 100n * 10n ** 18n,
        readVaultAsset: async () => undefined,
        getCoinsMarketData: async () => [
          {
            id: 'priced',
            circulating_supply: 250,
            last_updated: '2026-09-03T07:57:20.000Z',
          },
        ],
      },
    )

    expect(result[0]?.estimatedValueUsd).toEqual(200)
  })

  it('does not calculate value from a price marked as unreliable', async () => {
    const tokenAddress = address(1)
    const getClosestPricesAtOrBefore = mockFn().resolvesTo(new Map([[0, 2]]))
    const deployedToken = mockObject<TokenDatabase['deployedToken']>({
      getByChainAndAddress: mockFn().resolvesTo([
        token('chain-a', tokenAddress, 18, 'unreliable', true),
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

    const result = await getSupplyEstimates(
      mockObject<Database>({
        interopRecentPrices: mockObject<Database['interopRecentPrices']>({
          getClosestPricesAtOrBefore,
        }),
      }),
      mockObject<TokenDatabase>({ deployedToken, chain }),
      [{ chain: 'chain-a', address: tokenAddress }],
      {
        readTotalSupply: async () => 100n * 10n ** 18n,
        readVaultAsset: async () => undefined,
        getCoinsMarketData: async () => [
          {
            id: 'unreliable',
            circulating_supply: 50,
            last_updated: '2026-09-03T07:57:20.000Z',
          },
        ],
      },
    )

    expect(result).toEqual([
      {
        chain: 'chain-a',
        address: tokenAddress,
        totalSupply: '100',
        estimatedValueUsd: undefined,
        coingeckoCirculatingSupply: 50,
        coingeckoUpdatedAt: '2026-09-03T07:57:20.000Z',
        vaultAsset: undefined,
      },
    ])
    expect(getClosestPricesAtOrBefore.calls[0]?.args[0]).toEqual([])
  })

  it('caps work before querying repositories', async () => {
    const getByChainAndAddress = mockFn().resolvesTo([])
    const deployedToken = mockObject<TokenDatabase['deployedToken']>({
      getByChainAndAddress,
    })
    const chain = mockObject<TokenDatabase['chain']>({
      getAll: mockFn().resolvesTo([]),
    })
    const interopRecentPrices = mockObject<Database['interopRecentPrices']>({
      getClosestPricesAtOrBefore: mockFn().resolvesTo(new Map()),
    })
    const requests = Array.from(
      { length: SUPPLY_ESTIMATE_LIMIT + 1 },
      (_, i) => ({
        chain: 'chain-a',
        address: address(i + 1),
      }),
    )

    const result = await getSupplyEstimates(
      mockObject<Database>({ interopRecentPrices }),
      mockObject<TokenDatabase>({ deployedToken, chain }),
      requests,
    )

    expect(result).toHaveLength(SUPPLY_ESTIMATE_LIMIT)
    expect(getByChainAndAddress.calls[0]?.args[0]).toHaveLength(
      SUPPLY_ESTIMATE_LIMIT,
    )
  })
})

function token(
  chain: string,
  tokenAddress: string,
  decimals: number,
  coingeckoId: string | null,
  isPriceUnreliable = false,
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
      deploymentTimestamp: UnixTime(1),
      comment: null,
      metadata: null,
      ignored: false,
    },
    abstractToken: {
      id: 'TOKEN',
      symbol: 'TKN',
      coingeckoId,
      issuer: null,
      category: 'other',
      iconUrl: null,
      coingeckoListingTimestamp: null,
      additionalCoingeckoEntries: null,
      comment: null,
      reviewed: true,
      isPriceUnreliable,
    },
  }
}

function address(value: number): string {
  return `0x${value.toString(16).padStart(40, '0')}`
}
