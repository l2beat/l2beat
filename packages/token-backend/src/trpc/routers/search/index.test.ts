import type { Database, TokenDatabase } from '@l2beat/database'
import { describe, expect, it, vi } from 'vitest'
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
      const mockTokenDb = {
        deployedToken: {
          getAll: vi.fn().mockResolvedValue(deployedTokens),
        } as unknown as TokenDatabase['deployedToken'],
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['abstractToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase

      const caller = createRouter(mockTokenDb)
      const result = await caller.all(
        '0x0000000000000000000000000000000000000000',
      )

      expect(result).toStrictEqual({
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
      const mockGetAllDeployed = vi.fn().mockResolvedValue(deployedTokens)
      const mockGetAllAbstract = vi.fn().mockResolvedValue(abstractTokens)
      const mockGetAllChains = vi.fn().mockResolvedValue([])
      const mockTokenDb = {
        deployedToken: {
          getAll: mockGetAllDeployed,
        } as unknown as TokenDatabase['deployedToken'],
        abstractToken: {
          getAll: mockGetAllAbstract,
        } as unknown as TokenDatabase['abstractToken'],
        chain: {
          getAll: mockGetAllChains,
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('bitcoin')

      expect(result.abstractTokens.length).toBeGreaterThan(0)
      expect(result.abstractTokens[0]?.symbol).toStrictEqual('Bitcoin')
      expect(mockGetAllDeployed).toHaveBeenCalledWith()
      expect(mockGetAllAbstract).toHaveBeenCalledWith()
      expect(mockGetAllChains).toHaveBeenCalledWith()
    })

    it('returns empty arrays when no tokens exist', async () => {
      const mockTokenDb = {
        deployedToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['abstractToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('test')

      expect(result).toStrictEqual({
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
      const mockTokenDb = {
        deployedToken: {
          getAll: vi.fn().mockResolvedValue(deployedTokens),
        } as unknown as TokenDatabase['deployedToken'],
        abstractToken: {
          getAll: vi.fn().mockResolvedValue(abstractTokens),
        } as unknown as TokenDatabase['abstractToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase

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
      const mockTokenDb = {
        deployedToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['deployedToken'],
        abstractToken: {
          getAll: vi.fn().mockResolvedValue([]),
        } as unknown as TokenDatabase['abstractToken'],
        chain: {
          getAll: vi.fn().mockResolvedValue(chains),
        } as unknown as TokenDatabase['chain'],
      } as unknown as TokenDatabase

      const caller = createRouter(mockTokenDb)
      const result = await caller.all('ethereum')

      expect(result.chains.length).toBeGreaterThan(0)
      expect(result.chains[0]?.name).toStrictEqual('ethereum')
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
    db: {} as unknown as Database,
    tokenDb: mockTokenDb,
    tokenIngestionProcessor: {} as unknown as TokenIngestionProcessor,
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
