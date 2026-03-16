import type {
  Database,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import type {
  AbstractTokenRecord,
  AbstractTokenRepository,
} from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { ChainRepository } from '@l2beat/database/dist/repositories/ChainRepository'
import type {
  DeployedTokenRecord,
  DeployedTokenRepository,
} from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import type { InteropTransferRepository } from '@l2beat/database/dist/repositories/InteropTransferRepository'
import { expect, mockFn, mockObject } from 'earl'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import { createCallerFactory } from '../../trpc'
import { type DeployedTokensRouterDeps, deployedTokensRouter } from './index'

describe('deployedTokensRouter', () => {
  describe('findByChainAndAddress', () => {
    it('returns null when token is not found', async () => {
      const mockFindByChainAndAddress = mockFn().resolvesTo(undefined)
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFindByChainAndAddress,
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.findByChainAndAddress({
        chain: 'ethereum',
        address: '0x123',
      })
      expect(result).toEqual(null)
      expect(mockFindByChainAndAddress).toHaveBeenCalledWith({
        chain: 'ethereum',
        address: '0x123',
      })
    })

    it('returns token when found', async () => {
      const token = {
        chain: 'ethereum',
        address: '0x123',
        symbol: 'USDC',
        decimals: 6,
        comment: null,
        abstractTokenId: null,
        deploymentTimestamp: 0,
        metadata: {
          tvs: {
            includeInCalculations: true,
            source: 'external',
            supply: 'circulatingSupply',
            bridgedUsing: [
              {
                name: 'arbitrum',
                slug: 'arbitrum',
              },
            ],
            excludeFromTotal: false,
          },
        },
      } satisfies DeployedTokenRecord
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(token),
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.findByChainAndAddress({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(token)
    })
  })

  describe('checkIfExists', () => {
    it('returns false when token does not exist', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checkIfExists({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(false)
    })

    it('returns true when token exists', async () => {
      const token = {
        id: 1,
        chain: 'ethereum',
        address: '0x123',
      }
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(token),
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checkIfExists({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(true)
    })
  })

  describe('getByChainAndAddress', () => {
    it('returns tokens for multiple chain-address pairs', async () => {
      const tokens = [
        {
          deployedToken: {
            chain: 'ethereum',
            address: '0x123',
            symbol: 'USDC',
            decimals: 6,
            comment: null,
            abstractTokenId: null,
            deploymentTimestamp: 0,
            metadata: {
              tvs: {
                includeInCalculations: true,
                source: 'external',
                supply: 'circulatingSupply',
                bridgedUsing: [],
                excludeFromTotal: false,
              },
            },
          },
          abstractToken: undefined,
        },
        {
          deployedToken: {
            chain: 'arbitrum',
            address: '0x456',
            symbol: 'USDT',
            decimals: 6,
            comment: null,
            abstractTokenId: null,
            deploymentTimestamp: 0,
            metadata: {
              tvs: {
                includeInCalculations: true,
                source: 'canonical',
                supply: 'zero',
                bridgedUsing: [],
                excludeFromTotal: false,
              },
            },
          },
          abstractToken: undefined,
        },
      ] satisfies {
        deployedToken: DeployedTokenRecord
        abstractToken: AbstractTokenRecord | undefined
      }[]
      const mockGetByChainAndAddress = mockFn().resolvesTo(tokens)
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainAndAddress: mockGetByChainAndAddress,
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getByChainAndAddress([
        { chain: 'ethereum', address: '0x123' },
        { chain: 'arbitrum', address: '0x456' },
      ])

      expect(result).toEqual(tokens)
      expect(mockGetByChainAndAddress).toHaveBeenCalledWith([
        { chain: 'ethereum', address: '0x123' },
        { chain: 'arbitrum', address: '0x456' },
      ])
    })
  })

  describe('checks', () => {
    it('returns already-exists error when token already exists', async () => {
      const existingToken = {
        id: 1,
        chain: 'ethereum',
        address: '0x123',
      }
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(existingToken),
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual({
        error: {
          type: 'already-exists',
          message: 'Deployed token with given address and chain already exists',
        },
        data: undefined,
      })
    })

    it('returns undefined error and data when address does not start with 0x', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: 'invalid-address',
      })

      expect(result).toEqual({
        error: undefined,
        data: undefined,
      })
    })

    it('throws when chain is not found', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(undefined),
        }),
      })
      const mockDb = mockObject<Database>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      await expect(
        caller.checks({
          chain: 'nonexistent',
          address: '0x123',
        }),
      ).toBeRejectedWith('Chain not found')
    })

    it('includes rpc symbol and decimals in success response when available', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetDecimals = mockFn().resolvesTo(18)
      const mockGetSymbol = mockFn().resolvesTo('RPC-TKN')
      const mockCreateChain = mockFn().returns({
        rpc: {
          getDecimals: mockGetDecimals,
          getSymbol: mockGetSymbol,
        },
      })
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([chainRecord]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          findByCoingeckoId: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([
          {
            id: 'token-id',
            name: 'Token',
            symbol: 'TKN',
            platforms: {
              ethereum: '0x123',
            },
          },
        ]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual({
        error: undefined,
        data: {
          symbol: 'RPC-TKN',
          symbolSource: 'rpc',
          suggestions: [],
          decimals: 18,
          deploymentTimestamp: undefined,
          abstractTokenId: undefined,
          coingeckoId: 'token-id',
          abstractTokenSuggestions: undefined,
        },
      })
      expect(mockCreateChain).toHaveBeenCalledWith(chainRecord)
      expect(mockGetDecimals).toHaveBeenCalledWith('0x123')
      expect(mockGetSymbol).toHaveBeenCalledWith('0x123')
    })

    it('includes rpc symbol and decimals in not-found-on-coingecko response', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetDecimals = mockFn().resolvesTo(6)
      const mockGetSymbol = mockFn().resolvesTo('USDC-RPC')
      const mockCreateChain = mockFn().returns({
        rpc: {
          getDecimals: mockGetDecimals,
          getSymbol: mockGetSymbol,
        },
      })
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([chainRecord]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual({
        error: {
          type: 'not-found-on-coingecko',
          message: 'Coin not found on Coingecko',
        },
        data: {
          symbol: 'USDC-RPC',
          symbolSource: 'rpc',
          suggestions: undefined,
          decimals: 6,
          deploymentTimestamp: undefined,
          abstractTokenId: undefined,
          coingeckoId: undefined,
          abstractTokenSuggestions: [],
        },
      })
      expect(mockCreateChain).toHaveBeenCalledWith(chainRecord)
      expect(mockGetDecimals).toHaveBeenCalledWith('0x123')
      expect(mockGetSymbol).toHaveBeenCalledWith('0x123')
    })

    it('returns not-found-on-coingecko error when coin is not found', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: [],
              apis: [],
            },
          ]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual({
        error: {
          type: 'not-found-on-coingecko',
          message: 'Coin not found on Coingecko',
        },
        data: {
          symbol: undefined,
          symbolSource: undefined,
          suggestions: undefined,
          decimals: undefined,
          deploymentTimestamp: undefined,
          abstractTokenId: undefined,
          coingeckoId: undefined,
          abstractTokenSuggestions: undefined,
        },
      })
    })

    it('suggests abstract tokens with exact symbol match when not found on coingecko', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockCreateChain = mockFn().returns({
        rpc: {
          getDecimals: mockFn().resolvesTo(18),
          getSymbol: mockFn().resolvesTo('USDC'),
        },
      })
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([chainRecord]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([
            {
              id: 'abc123',
              symbol: 'USDC',
              issuer: 'circle',
              category: 'stablecoin',
              iconUrl: null,
              coingeckoId: 'usd-coin',
              coingeckoListingTimestamp: null,
              comment: null,
              reviewed: true,
            },
            {
              id: 'def456',
              symbol: 'ETH',
              issuer: null,
              category: 'ether',
              iconUrl: null,
              coingeckoId: 'ethereum',
              coingeckoListingTimestamp: null,
              comment: null,
              reviewed: true,
            },
          ]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.abstractTokenSuggestions).toEqual([
        {
          id: 'abc123',
          symbol: 'USDC',
          issuer: 'circle',
        },
      ])
    })

    it('suggests abstract tokens with fuzzy symbol match (e.g. USDC.e matches USDC)', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockCreateChain = mockFn().returns({
        rpc: {
          getDecimals: mockFn().resolvesTo(18),
          getSymbol: mockFn().resolvesTo('USDC.e'),
        },
      })
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([chainRecord]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([
            {
              id: 'abc123',
              symbol: 'USDC',
              issuer: 'circle',
              category: 'stablecoin',
              iconUrl: null,
              coingeckoId: 'usd-coin',
              coingeckoListingTimestamp: null,
              comment: null,
              reviewed: true,
            },
            {
              id: 'def456',
              symbol: 'WETH',
              issuer: null,
              category: 'ether',
              iconUrl: null,
              coingeckoId: 'weth',
              coingeckoListingTimestamp: null,
              comment: null,
              reviewed: true,
            },
          ]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.abstractTokenSuggestions?.[0]).toEqual({
        id: 'abc123',
        symbol: 'USDC',
        issuer: 'circle',
      })
    })

    it('does not suggest abstract tokens when no symbol is available', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockGetAll = mockFn().resolvesTo([])
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([chainRecord]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockGetAll,
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result.data?.abstractTokenSuggestions).toEqual(undefined)
      expect(mockGetAll).toHaveBeenCalledTimes(0)
    })

    it('limits abstract token suggestions to 5 results', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockCreateChain = mockFn().returns({
        rpc: {
          getDecimals: mockFn().resolvesTo(18),
          getSymbol: mockFn().resolvesTo('TOKEN'),
        },
      })
      const abstractTokens = Array.from({ length: 10 }, (_, i) => ({
        id: `id${i.toString().padStart(4, '0')}`,
        symbol: `TOKEN${i}`,
        issuer: null,
        category: 'other' as const,
        iconUrl: null,
        coingeckoId: null,
        coingeckoListingTimestamp: null,
        comment: null,
        reviewed: true,
      }))
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([chainRecord]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo(abstractTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient, {
        createChain: mockCreateChain,
      })
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0x123',
      })

      const suggestions = result.data?.abstractTokenSuggestions ?? []
      expect(suggestions.length).toBeLessThanOrEqual(5)
    })

    it('returns success with token data when all checks pass', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
          ]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          findByCoingeckoId: mockFn().resolvesTo({
            id: '1',
            coingeckoId: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            issuer: null,
            comment: null,
          }),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            },
          },
        ]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data).toEqual({
        symbol: 'USDC',
        symbolSource: 'coingecko',
        decimals: undefined,
        deploymentTimestamp: undefined,
        abstractTokenId: '1',
        suggestions: [],
        coingeckoId: 'usd-coin',
        abstractTokenSuggestions: undefined,
      })
    })

    it('handles chain aliases correctly', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
          ]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          findByCoingeckoId: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            },
          },
        ]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.symbol).toEqual('USDC')
    })

    it('returns otherChains information', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn()
            .resolvesTo(undefined)
            .given({
              chain: 'arbitrum',
              address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            })
            .resolvesToOnce({
              id: 2,
              chain: 'arbitrum',
              address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
              symbol: 'USDC',
              decimals: 6,
              comment: null,
              abstractTokenId: null,
              deploymentTimestamp: 0,
            }),
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
            {
              id: 2,
              name: 'arbitrum',
              chainId: 42161,
              aliases: ['arb'],
              apis: [],
            },
          ]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          findByCoingeckoId: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
              arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            },
          },
        ]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.suggestions).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
      ])
    })

    it('handles case-insensitive address matching', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(chainRecord),
          getAll: mockFn().resolvesTo([
            {
              id: 1,
              name: 'ethereum',
              chainId: 1,
              aliases: ['eth'],
              apis: [],
            },
          ]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          findByCoingeckoId: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinList: mockFn().resolvesTo([
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            platforms: {
              eth: '0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
            },
          },
        ]),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data?.symbol).toEqual('USDC')
    })
  })

  describe('getSuggestionsByCoingeckoId', () => {
    it('returns empty array when coin is not found', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo(null),
      })
      const mockDb = mockObject<Database>({})
      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result =
        await caller.getSuggestionsByCoingeckoId('nonexistent-coin')

      expect(result).toEqual([])
    })

    it('returns suggestions for platforms that do not have deployed tokens', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
        {
          id: 2,
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [],
        },
        {
          id: 3,
          name: 'optimism',
          chainId: 10,
          aliases: ['op'],
          apis: [],
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainsAndAddresses: mockFn().resolvesTo(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
            op: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
          },
        }),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqualUnsorted([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
        {
          chain: 'optimism',
          address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        },
      ])
    })

    it('returns empty array when all platforms already have deployed tokens', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
        {
          id: 2,
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [],
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainsAndAddresses: mockFn().resolvesTo(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          },
        }),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([])
    })

    it('filters out platforms with empty address', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
      ]
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            polygon: '',
          },
        }),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
      ])
    })

    it('filters out platforms that do not match any chain', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
      ]
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            unknown: '0x1234567890123456789012345678901234567890',
          },
        }),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
      ])
    })

    it('handles chain aliases correctly', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
      ]
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainsAndAddresses: mockFn().resolvesTo([]),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          },
        }),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        },
      ])
    })

    it('handles case-insensitive address matching when checking existing tokens', async () => {
      const chains = [
        {
          id: 1,
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [],
        },
        {
          id: 2,
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [],
        },
      ]
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0xA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockDb = mockObject<Database>({})
      const mockTokenDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainsAndAddresses: mockFn().resolvesTo(deployedTokens),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo({
          id: 'usd-coin',
          image: { large: 'https://example.com/image.png' },
          platforms: {
            eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            arb: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
          },
        }),
      })

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
      ])
    })
  })

  describe('getSuggestionsByPartialTransfers', () => {
    function makeTransfer(
      overrides: Partial<InteropTransferRecord>,
    ): InteropTransferRecord {
      return {
        plugin: 'test-plugin',
        bridgeType: undefined,
        transferId: 'transfer-1',
        type: 'transfer',
        duration: 10,
        timestamp: 1000,
        srcTime: 1000,
        srcChain: 'ethereum',
        srcTxHash: '0xsrc',
        srcLogIndex: 0,
        srcEventId: 'src-event',
        srcTokenAddress:
          '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        srcRawAmount: undefined,
        srcWasBurned: false,
        srcAbstractTokenId: undefined,
        srcSymbol: undefined,
        srcAmount: undefined,
        srcPrice: undefined,
        srcValueUsd: undefined,
        dstTime: 1000,
        dstChain: 'arbitrum',
        dstTxHash: '0xdst',
        dstLogIndex: 0,
        dstEventId: 'dst-event',
        dstTokenAddress:
          '0x000000000000000000000000af88d065e77c8cc2239327c5edb3a432268e5831',
        dstRawAmount: undefined,
        dstWasMinted: true,
        dstAbstractTokenId: 'abstract-usdc',
        dstSymbol: undefined,
        dstAmount: undefined,
        dstPrice: undefined,
        dstValueUsd: undefined,
        isProcessed: false,
        ...overrides,
      }
    }

    it('returns empty array when no partial transfers exist', async () => {
      const mockDb = mockObject<Database>({
        interopTransfer: mockObject<InteropTransferRepository>({
          getWithPartialAbstractTokenIds: mockFn().resolvesTo([]),
        }),
      })
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([])
    })

    it('returns suggestion for src side when srcAbstractTokenId is missing', async () => {
      const transfer = makeTransfer({
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })

      const mockDb = mockObject<Database>({
        interopTransfer: mockObject<InteropTransferRepository>({
          getWithPartialAbstractTokenIds: mockFn().resolvesTo([transfer]),
        }),
      })
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          abstractTokenId: 'abstract-usdc',
          txs: [
            {
              srcTxHash: '0xsrc',
              srcChain: 'ethereum',
              dstTxHash: '0xdst',
              dstChain: 'arbitrum',
              transferId: 'transfer-1',
            },
          ],
        },
      ])
    })

    it('returns suggestion for dst side when dstAbstractTokenId is missing', async () => {
      const transfer = makeTransfer({
        srcAbstractTokenId: 'abstract-usdc',
        srcWasBurned: true,
        dstAbstractTokenId: undefined,
        dstWasMinted: true,
      })

      const mockDb = mockObject<Database>({
        interopTransfer: mockObject<InteropTransferRepository>({
          getWithPartialAbstractTokenIds: mockFn().resolvesTo([transfer]),
        }),
      })
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
          abstractTokenId: 'abstract-usdc',
          txs: [
            {
              srcTxHash: '0xsrc',
              srcChain: 'ethereum',
              dstTxHash: '0xdst',
              dstChain: 'arbitrum',
              transferId: 'transfer-1',
            },
          ],
        },
      ])
    })

    it('groups multiple transfers for the same chain/address/abstractTokenId', async () => {
      const transfer1 = makeTransfer({
        transferId: 'transfer-1',
        srcTxHash: '0xsrc1',
        dstTxHash: '0xdst1',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })
      const transfer2 = makeTransfer({
        transferId: 'transfer-2',
        srcTxHash: '0xsrc2',
        dstTxHash: '0xdst2',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })

      const mockDb = mockObject<Database>({
        interopTransfer: mockObject<InteropTransferRepository>({
          getWithPartialAbstractTokenIds: mockFn().resolvesTo([
            transfer1,
            transfer2,
          ]),
        }),
      })
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          abstractTokenId: 'abstract-usdc',
          txs: [
            {
              srcTxHash: '0xsrc1',
              srcChain: 'ethereum',
              dstTxHash: '0xdst1',
              dstChain: 'arbitrum',
              transferId: 'transfer-1',
            },
            {
              srcTxHash: '0xsrc2',
              srcChain: 'ethereum',
              dstTxHash: '0xdst2',
              dstChain: 'arbitrum',
              transferId: 'transfer-2',
            },
          ],
        },
      ])
    })

    it('excludes nonMinting and unknown transfers from suggestions', async () => {
      const nonMintingTransfer = makeTransfer({
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: false,
      })

      const mockDb = mockObject<Database>({
        interopTransfer: mockObject<InteropTransferRepository>({
          getWithPartialAbstractTokenIds: mockFn().resolvesTo([
            nonMintingTransfer,
          ]),
        }),
      })
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([])
    })

    it('returns suggestions from both lockAndMint and burnAndMint transfers', async () => {
      const lockAndMintTransfer = makeTransfer({
        transferId: 'lock-mint-1',
        srcTxHash: '0xsrcLM',
        dstTxHash: '0xdstLM',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: false,
        dstWasMinted: true,
      })
      const burnAndMintTransfer = makeTransfer({
        transferId: 'burn-mint-1',
        srcTxHash: '0xsrcBM',
        dstTxHash: '0xdstBM',
        srcChain: 'optimism',
        srcTokenAddress:
          '0x0000000000000000000000000b2c639c533813f4aa9d7837caf62653d097ff85',
        srcAbstractTokenId: undefined,
        dstAbstractTokenId: 'abstract-usdc',
        srcWasBurned: true,
        dstWasMinted: true,
      })

      const mockDb = mockObject<Database>({
        interopTransfer: mockObject<InteropTransferRepository>({
          getWithPartialAbstractTokenIds: mockFn().resolvesTo([
            lockAndMintTransfer,
            burnAndMintTransfer,
          ]),
        }),
      })
      const mockTokenDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockTokenDb, mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByPartialTransfers()

      expect(result).toEqual([
        {
          chain: 'ethereum',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          abstractTokenId: 'abstract-usdc',
          txs: [
            {
              srcTxHash: '0xsrcLM',
              srcChain: 'ethereum',
              dstTxHash: '0xdstLM',
              dstChain: 'arbitrum',
              transferId: 'lock-mint-1',
            },
          ],
        },
        {
          chain: 'optimism',
          address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          abstractTokenId: 'abstract-usdc',
          txs: [
            {
              srcTxHash: '0xsrcBM',
              srcChain: 'optimism',
              dstTxHash: '0xdstBM',
              dstChain: 'arbitrum',
              transferId: 'burn-mint-1',
            },
          ],
        },
      ])
    })
  })
})

function createRouter(
  mockTokenDb: TokenDatabase,
  mockDb: Database,
  mockCoingeckoClient: CoingeckoClient,
  deps: Partial<Pick<DeployedTokensRouterDeps, 'createChain'>> = {},
) {
  const router = deployedTokensRouter({
    coingeckoClient: mockCoingeckoClient,
    etherscanApiKey: 'test-api-key',
    ...deps,
  })

  const callerFactory = createCallerFactory(router)
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    db: mockDb,
    tokenDb: mockTokenDb,
  })
}
