import type {
  Database,
  DeployedTokenRecord,
  TokenDatabase,
} from '@l2beat/database'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import type { TokenIngestionProcessor } from '../../../ingestion/TokenIngestionProcessor'
import type { AbstractTokenRecord } from '../../../schemas/AbstractToken'
import { createCallerFactory } from '../../trpc'
import { abstractTokensRouter } from './index'

describe('abstractTokensRouter', () => {
  describe('getAll', () => {
    it('returns all abstract tokens', async () => {
      const abstractTokens = [
        abstractToken({
          id: 'TK0001',
          symbol: 'BTC',
          category: 'btc' as const,
          issuer: null,
          coingeckoId: 'bitcoin',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        }),
        abstractToken({
          id: 'TK0002',
          symbol: 'ETH',
          category: 'ether' as const,
          issuer: null,
          coingeckoId: 'ethereum',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        }),
      ]
      const mockGetAll = vi.fn().mockResolvedValue(abstractTokens)
      const mockTokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: mockGetAll,
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.getAll()

      expect(result).toStrictEqual(abstractTokens)
      expect(mockGetAll).toHaveBeenCalledWith()
    })

    it('returns empty array when no tokens exist', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: vi.fn().mockResolvedValue([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.getAll()

      expect(result).toStrictEqual([])
    })
  })

  describe('getAllWithDeployedTokens', () => {
    it('returns abstract tokens with their deployed tokens', async () => {
      const abstractTokens = [
        abstractToken({
          id: 'TK0001',
          symbol: 'USDC',
          category: 'stablecoin' as const,
          issuer: null,
          coingeckoId: 'usd-coin',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        }),
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
          metadata: {
            tvs: {
              includeInCalculations: true,
              excludeFromTotal: false,
              source: 'external',
              supply: 'circulatingSupply',
              bridgedUsing: [],
            },
          },
        },
        {
          chain: 'arbitrum',
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
          metadata: {
            tvs: {
              includeInCalculations: false,
              excludeFromTotal: true,
              source: 'external',
              supply: 'circulatingSupply',
              bridgedUsing: [],
            },
          },
        },
        {
          chain: 'optimism',
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'TOKEN',
          decimals: 18,
          comment: null,
          ignored: false,
          abstractTokenId: null,
          deploymentTimestamp: 0,
          metadata: {
            tvs: {
              includeInCalculations: false,
              excludeFromTotal: true,
              source: 'external',
              supply: 'zero',
              bridgedUsing: [
                {
                  name: 'optimism',
                  slug: 'optimism',
                },
              ],
            },
          },
        },
      ] satisfies DeployedTokenRecord[]
      const mockTokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: vi.fn().mockResolvedValue(abstractTokens),
        }),
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: vi.fn().mockResolvedValue(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.getAllWithDeployedTokens()

      expect(result.abstractTokens).toStrictEqual([
        {
          ...abstractTokens[0],
          deployedTokens: [deployedTokens[0], deployedTokens[1]],
        },
      ])
      expect(result.deployedWithoutAbstractTokens).toStrictEqual([
        deployedTokens[2],
      ])
    })

    it('handles abstract tokens without deployed tokens', async () => {
      const abstractTokens = [
        abstractToken({
          id: 'TK0001',
          symbol: 'BTC',
          category: 'btc' as const,
          issuer: null,
          coingeckoId: 'bitcoin',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        }),
      ]
      const mockTokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: vi.fn().mockResolvedValue(abstractTokens),
        }),
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: vi.fn().mockResolvedValue([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.getAllWithDeployedTokens()

      expect(result.abstractTokens).toStrictEqual([
        {
          ...abstractTokens[0],
          deployedTokens: [],
        },
      ])
      expect(result.deployedWithoutAbstractTokens).toStrictEqual([])
    })
  })

  describe('getById', () => {
    it('returns abstract token with deployed tokens', async () => {
      const token = abstractToken({
        id: 'TK0001',
        symbol: 'USDC',
        category: 'stablecoin' as const,
        issuer: null,
        coingeckoId: 'usd-coin',
        iconUrl: null,
        comment: null,
        coingeckoListingTimestamp: null,
        reviewed: false,
      })
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          ignored: false,
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
          metadata: {
            tvs: {
              includeInCalculations: true,
              source: 'external',
              supply: 'circulatingSupply',
              excludeFromTotal: false,
              bridgedUsing: [
                {
                  name: 'arbitrum',
                  slug: 'arbitrum',
                },
              ],
            },
          },
        },
      ] satisfies DeployedTokenRecord[]
      const mockTokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          findById: vi.fn().mockResolvedValue(token),
        }),
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getByAbstractTokenId: vi.fn().mockResolvedValue(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.getById('TK0001')

      expect(result).toStrictEqual({
        ...token,
        deployedTokens,
      })
    })

    it('returns null when abstract token does not exist', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          findById: vi.fn().mockResolvedValue(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.getById('TK9999')

      expect(result).toStrictEqual(null)
    })
  })

  describe('checks', () => {
    it('returns not-found-on-coingecko error when coin does not exist', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: vi.fn().mockRejectedValue(new Error('Coin not found')),
      })

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.checks('nonexistent-coin')

      expect(result).toStrictEqual({
        error: {
          type: 'not-found-on-coingecko',
          message: 'Coin not found on Coingecko',
        },
        data: undefined,
      })
    })

    it('returns coin data with listing timestamp', async () => {
      const coin = {
        id: 'bitcoin',
        symbol: 'BTC',
        image: {
          large: 'https://example.com/bitcoin.png',
        },
      }
      const marketChart = {
        prices: [
          {
            date: new Date('2009-01-03'),
            value: 0.05,
          },
        ],
        marketCaps: [],
      }
      const mockGetCoinDataById = vi.fn().mockResolvedValue(coin)
      const mockGetCoinMarketChartRange = vi.fn().mockResolvedValue(marketChart)
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockGetCoinDataById,
        getCoinMarketChartRange: mockGetCoinMarketChartRange,
      })

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.checks('bitcoin')

      expect(result?.error).toStrictEqual(undefined)
      expect(result?.data?.id).toStrictEqual('bitcoin')
      expect(result?.data?.iconUrl).toStrictEqual(
        'https://example.com/bitcoin.png',
      )
      expect(result?.data?.symbol).toStrictEqual('BTC')
      expect(result?.data?.listingTimestamp).not.toStrictEqual(undefined)
      expect(mockGetCoinDataById).toHaveBeenCalledWith('bitcoin')
    })

    it('returns coin even if market chart has no prices', async () => {
      const coin = {
        id: 'bitcoin',
        symbol: 'BTC',
        image: {
          large: 'https://example.com/bitcoin.png',
        },
      }
      const marketChart = {
        prices: [],
        marketCaps: [],
      }
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: vi.fn().mockResolvedValue(coin),
        getCoinMarketChartRange: vi.fn().mockResolvedValue(marketChart),
      })

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.checks('bitcoin')

      expect(result).toStrictEqual({
        error: undefined,
        data: {
          id: 'bitcoin',
          iconUrl: 'https://example.com/bitcoin.png',
          symbol: 'BTC',
          listingTimestamp: undefined,
        },
      })
    })

    it('returns coin data without listing timestamp when market chart fails', async () => {
      const coin = {
        id: 'bitcoin',
        symbol: 'BTC',
        image: {
          large: 'https://example.com/bitcoin.png',
        },
      }
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: vi.fn().mockResolvedValue(coin),
        getCoinMarketChartRange: vi
          .fn()
          .mockRejectedValue(new Error('API error')),
      })

      const caller = createRouter(mockTokenDb, mockCoingeckoClient)
      const result = await caller.checks('bitcoin')

      expect(result?.error).toStrictEqual(undefined)
      expect(result?.data?.id).toStrictEqual('bitcoin')
      expect(result?.data?.iconUrl).toStrictEqual(
        'https://example.com/bitcoin.png',
      )
      expect(result?.data?.symbol).toStrictEqual('BTC')
      expect(result?.data?.listingTimestamp).toStrictEqual(undefined)
    })
  })
})

function createRouter(
  mockTokenDb: TokenDatabase,
  mockCoingeckoClient: CoingeckoClient,
) {
  const router = abstractTokensRouter({
    coingeckoClient: mockCoingeckoClient,
  })

  const callerFactory = createCallerFactory(router)
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    tokenDb: mockTokenDb,
    db: mockObject<Database>({}),
    tokenIngestionProcessor: mockObject<TokenIngestionProcessor>({}),
  })
}

function abstractToken(
  overrides: Partial<AbstractTokenRecord> & Pick<AbstractTokenRecord, 'id'>,
): AbstractTokenRecord {
  return {
    id: overrides.id,
    symbol: overrides.symbol ?? 'TOKEN',
    category: overrides.category ?? null,
    issuer: overrides.issuer ?? null,
    coingeckoId: overrides.coingeckoId ?? null,
    iconUrl: overrides.iconUrl ?? null,
    comment: overrides.comment ?? null,
    coingeckoListingTimestamp: overrides.coingeckoListingTimestamp ?? null,
    additionalCoingeckoEntries: overrides.additionalCoingeckoEntries ?? null,
    reviewed: overrides.reviewed ?? false,
    isPriceUnreliable: overrides.isPriceUnreliable ?? false,
  }
}
