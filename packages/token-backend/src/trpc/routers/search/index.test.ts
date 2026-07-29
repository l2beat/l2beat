import type { Database, TokenDatabase } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import type { TokenIngestionProcessor } from '../../../ingestion/TokenIngestionProcessor'
import type { AbstractTokenRecord } from '../../../schemas/AbstractToken'
import { createCallerFactory } from '../../trpc'
import { searchRouter } from './index'

describe('searchRouter', () => {
  describe('tokens', () => {
    it('returns empty arrays when address does not match', async () => {
      const deployedTokens = [
        {
          chain: 'ethereum',
          address: '0x1234567890123456789012345678901234567890',
          symbol: 'USDC',
          decimals: 6,
          comment: null,
          abstractTokenId: null,
          deploymentTimestamp: 0,
        },
      ]
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: mockFn().resolvesTo(deployedTokens),
        }),
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: mockFn().resolvesTo([]),
        }),
        chain: mockObject<TokenDatabase['chain']>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockTokenDb)
      const result = await caller.all(
        '0x0000000000000000000000000000000000000000',
      )

      expect(result).toEqual({
        deployedTokens: [],
        abstractTokens: [],
        chains: [],
      })
    })

    it('returns fuzzy search results', async () => {
      const abstractTokens = [
        abstractToken({
          id: 'TK0001',
          symbol: 'Bitcoin',
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
          symbol: 'Ethereum',
          category: 'ether' as const,
          issuer: null,
          coingeckoId: 'ethereum',
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
          abstractTokenId: 'TK0001',
          deploymentTimestamp: 0,
        },
      ]
      const mockGetAllDeployed = mockFn().resolvesTo(deployedTokens)
      const mockGetAllAbstract = mockFn().resolvesTo(abstractTokens)
      const mockGetAllChains = mockFn().resolvesTo([])
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: mockGetAllDeployed,
        }),
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: mockGetAllAbstract,
        }),
        chain: mockObject<TokenDatabase['chain']>({
          getAll: mockGetAllChains,
        }),
      })

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('bitcoin')

      expect(result.abstractTokens.length).toBeGreaterThan(0)
      expect(result.abstractTokens[0]?.symbol).toEqual('Bitcoin')
      expect(mockGetAllDeployed).toHaveBeenCalledWith()
      expect(mockGetAllAbstract).toHaveBeenCalledWith()
      expect(mockGetAllChains).toHaveBeenCalledWith()
    })

    it('returns empty arrays when no tokens exist', async () => {
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: mockFn().resolvesTo([]),
        }),
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: mockFn().resolvesTo([]),
        }),
        chain: mockObject<TokenDatabase['chain']>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('test')

      expect(result).toEqual({
        deployedTokens: [],
        abstractTokens: [],
        chains: [],
      })
    })

    it('limits results to 15 items per type', async () => {
      const abstractTokens = Array.from({ length: 20 }, (_, i) =>
        abstractToken({
          id: `TK${String(i).padStart(4, '0')}`,
          symbol: `Token${i}`,
          category: 'other' as const,
        }),
      )
      const deployedTokens = Array.from({ length: 20 }, (_, i) => ({
        chain: 'ethereum',
        address: `0x${String(i).padStart(40, '0')}`,
        symbol: `Token${i}`,
        decimals: 18,
        comment: null,
        abstractTokenId: null,
        deploymentTimestamp: 0,
      }))
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: mockFn().resolvesTo(deployedTokens),
        }),
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: mockFn().resolvesTo(abstractTokens),
        }),
        chain: mockObject<TokenDatabase['chain']>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('token')

      expect(result.abstractTokens.length).toBeLessThanOrEqual(15)
      expect(result.deployedTokens.length).toBeLessThanOrEqual(15)
      expect(result.chains.length).toBeLessThanOrEqual(15)
    })

    it('returns fuzzy search results for chains', async () => {
      const chains = [
        {
          name: 'ethereum',
          chainId: 1,
          explorerUrl: 'https://etherscan.io',
          aliases: ['eth', 'mainnet'],
          apis: [{ type: 'etherscan' as const }],
        },
        {
          name: 'polygon',
          chainId: 137,
          explorerUrl: 'https://polygonscan.com',
          aliases: ['matic'],
          apis: [{ type: 'rpc' as const, url: 'https://polygon-rpc.com' }],
        },
        {
          name: 'arbitrum',
          chainId: 42161,
          explorerUrl: null,
          aliases: null,
          apis: null,
        },
      ]
      const mockTokenDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<TokenDatabase['deployedToken']>({
          getAll: mockFn().resolvesTo([]),
        }),
        abstractToken: mockObject<TokenDatabase['abstractToken']>({
          getAll: mockFn().resolvesTo([]),
        }),
        chain: mockObject<TokenDatabase['chain']>({
          getAll: mockFn().resolvesTo(chains),
        }),
      })

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('ethereum')

      expect(result.chains.length).toBeGreaterThan(0)
      expect(result.chains[0]?.name).toEqual('ethereum')
    })
  })
})

function createRouter(mockTokenDb: TokenDatabase) {
  const callerFactory = createCallerFactory(searchRouter)
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    db: mockObject<Database>({}),
    tokenDb: mockTokenDb,
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
