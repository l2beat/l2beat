import type { TokenDatabase } from '@l2beat/database'
import type {
  AbstractTokenRecord,
  AbstractTokenRepository,
} from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { ChainRepository } from '@l2beat/database/dist/repositories/ChainRepository'
import type {
  DeployedTokenRecord,
  DeployedTokenRepository,
} from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import { expect, mockFn, mockObject } from 'earl'
import type { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import { createCallerFactory } from '../trpc'
import { deployedTokensRouter } from './deployedTokens'

describe('deployedTokensRouter', () => {
  describe('findByChainAndAddress', () => {
    it('returns null when token is not found', async () => {
      const mockFindByChainAndAddress = mockFn().resolvesTo(undefined)
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFindByChainAndAddress,
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(token),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.findByChainAndAddress({
        chain: 'ethereum',
        address: '0x123',
      })

      expect(result).toEqual(token)
    })
  })

  describe('checkIfExists', () => {
    it('returns false when token does not exist', async () => {
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(token),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getByChainAndAddress: mockGetByChainAndAddress,
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(existingToken),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          findByChainAndAddress: mockFn().resolvesTo(undefined),
        }),
        chain: mockObject<ChainRepository>({
          findByName: mockFn().resolvesTo(undefined),
        }),
      })
      const mockCoingeckoClient = mockObject<CoingeckoClient>({})

      const caller = createRouter(mockDb, mockCoingeckoClient)
      await expect(
        caller.checks({
          chain: 'nonexistent',
          address: '0x123',
        }),
      ).toBeRejectedWith('Chain not found')
    })

    it('returns not-found-on-coingecko error when coin is not found', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: [],
        apis: [],
      }
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
          suggestions: undefined,
          decimals: undefined,
          deploymentTimestamp: undefined,
          abstractTokenId: undefined,
          coingeckoId: undefined,
        },
      })
    })

    it('returns success with token data when all checks pass', async () => {
      const chainRecord = {
        id: 1,
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth'],
        apis: [],
      }
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.checks({
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      })

      expect(result.error).toEqual(undefined)
      expect(result.data).toEqual({
        symbol: 'USDC',
        decimals: undefined,
        deploymentTimestamp: undefined,
        abstractTokenId: '1',
        suggestions: [],
        coingeckoId: 'usd-coin',
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({})
      const mockCoingeckoClient = mockObject<CoingeckoClient>({
        getCoinDataById: mockFn().resolvesTo(null),
      })

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
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
      const mockDb = mockObject<TokenDatabase>({
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

      const caller = createRouter(mockDb, mockCoingeckoClient)
      const result = await caller.getSuggestionsByCoingeckoId('usd-coin')

      expect(result).toEqual([
        {
          chain: 'arbitrum',
          address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        },
      ])
    })
  })
})

function createRouter(
  mockDb: TokenDatabase,
  mockCoingeckoClient: CoingeckoClient,
) {
  const router = deployedTokensRouter({
    coingeckoClient: mockCoingeckoClient,
    etherscanApiKey: 'test-api-key',
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
