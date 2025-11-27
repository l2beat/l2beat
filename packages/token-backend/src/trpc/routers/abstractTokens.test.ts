import type { TokenDatabase } from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import { expect, mockFn, mockObject } from 'earl'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import { createCallerFactory } from '../trpc'
import { abstractTokensRouter } from './abstractTokens'

describe('abstractTokensRouter', () => {
  describe('getAll', () => {
    it('returns all abstract tokens', async () => {
      const abstractTokens = [
        {
          id: 'TK0001',
          symbol: 'BTC',
          category: 'btc' as const,
          issuer: null,
          coingeckoId: 'bitcoin',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        },
        {
          id: 'TK0002',
          symbol: 'ETH',
          category: 'ether' as const,
          issuer: null,
          coingeckoId: 'ethereum',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        },
      ]
      const mockGetAll = mockFn().resolvesTo(abstractTokens)
      const mockDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockGetAll,
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getAll()

      expect(result).toEqual(abstractTokens)
      expect(mockGetAll).toHaveBeenCalledWith()
    })

    it('returns empty array when no tokens exist', async () => {
      const mockDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getAll()

      expect(result).toEqual([])
    })
  })

  describe('getAllWithDeployedTokens', () => {
    it('returns abstract tokens with their deployed tokens', async () => {
      const abstractTokens = [
        {
          id: 'TK0001',
          symbol: 'USDC',
          category: 'stablecoin' as const,
          issuer: null,
          coingeckoId: 'usd-coin',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
        },
        {
          chain: 'arbitrum',
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
        },
        {
          chain: 'optimism',
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'TOKEN',
          decimals: 18,
          comment: null,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo(abstractTokens),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getAllWithDeployedTokens()

      expect(result.abstractTokens).toEqual([
        {
          ...abstractTokens[0],
          deployedTokens: [deployedTokens[0], deployedTokens[1]],
        },
      ])
      expect(result.deployedWithoutAbstractTokens).toEqual([deployedTokens[2]])
    })

    it('handles abstract tokens without deployed tokens', async () => {
      const abstractTokens = [
        {
          id: 'TK0001',
          symbol: 'BTC',
          category: 'btc' as const,
          issuer: null,
          coingeckoId: 'bitcoin',
          iconUrl: null,
          comment: null,
          coingeckoListingTimestamp: null,
          reviewed: false,
        },
      ]
      const mockDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo(abstractTokens),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getAllWithDeployedTokens()

      expect(result.abstractTokens).toEqual([
        {
          ...abstractTokens[0],
          deployedTokens: [],
        },
      ])
      expect(result.deployedWithoutAbstractTokens).toEqual([])
    })
  })

  describe('getById', () => {
    it('returns abstract token with deployed tokens', async () => {
      const abstractToken = {
        id: 'TK0001',
        symbol: 'USDC',
        category: 'stablecoin' as const,
        issuer: null,
        coingeckoId: 'usd-coin',
        iconUrl: null,
        comment: null,
        coingeckoListingTimestamp: null,
        reviewed: false,
      }
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          findById: mockFn().resolvesTo(abstractToken),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByAbstractTokenId: mockFn().resolvesTo(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getById('TK0001')

      expect(result).toEqual({
        ...abstractToken,
        deployedTokens,
      })
    })

    it('returns null when abstract token does not exist', async () => {
      const mockDb = mockObject<TokenDatabase>({
        abstractToken: mockObject<AbstractTokenRepository>({
          findById: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getById('TK9999')

      expect(result).toEqual(null)
    })
  })

  describe('checks', () => {
    it('returns not-found-on-coingecko error when coin does not exist', async () => {
      const mockDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().rejectsWith(new Error('Coin not found')),
      })

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.checks('nonexistent-coin')

      expect(result).toEqual({
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
      const mockGetCoinDataById = mockFn().resolvesTo(coin)
      const mockGetCoinMarketChartRange = mockFn().resolvesTo(marketChart)
      const mockDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockGetCoinDataById,
        getCoinMarketChartRange: mockGetCoinMarketChartRange,
      })

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.checks('bitcoin')

      expect(result?.error).toEqual(undefined)
      expect(result?.data?.id).toEqual('bitcoin')
      expect(result?.data?.iconUrl).toEqual('https://example.com/bitcoin.png')
      expect(result?.data?.symbol).toEqual('BTC')
      expect(result?.data?.listingTimestamp).not.toEqual(undefined)
      expect(mockGetCoinDataById).toHaveBeenCalledWith('bitcoin')
    })

    it('returns null when market chart has no prices', async () => {
      const coin = {
        id: 'bitcoin',
        image: {
          large: 'https://example.com/bitcoin.png',
        },
      }
      const marketChart = {
        prices: [],
        marketCaps: [],
      }
      const mockDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo(coin),
        getCoinMarketChartRange: mockFn().resolvesTo(marketChart),
      })

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.checks('bitcoin')

      expect(result).toEqual(null)
    })

    it('returns coin data without listing timestamp when market chart fails', async () => {
      const coin = {
        id: 'bitcoin',
        symbol: 'BTC',
        image: {
          large: 'https://example.com/bitcoin.png',
        },
      }
      const mockDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo(coin),
        getCoinMarketChartRange: mockFn().rejectsWith(new Error('API error')),
      })

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.checks('bitcoin')

      expect(result?.error).toEqual(undefined)
      expect(result?.data?.id).toEqual('bitcoin')
      expect(result?.data?.iconUrl).toEqual('https://example.com/bitcoin.png')
      expect(result?.data?.symbol).toEqual('BTC')
      expect(result?.data?.listingTimestamp).toEqual(undefined)
    })
  })
})

function createRouter(
  mockDb: TokenDatabase,
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
    db: mockDb,
  })
}
