import type { TokenDatabase } from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { ChainRepository } from '@l2beat/database/dist/repositories/ChainRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../trpc'
import { searchRouter } from './search'

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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo(deployedTokens),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockDb)
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
        {
          id: 'TK0001',
          symbol: 'Bitcoin',
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
          symbol: 'Ethereum',
          category: 'ether' as const,
          issuer: null,
          coingeckoId: 'ethereum',
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
      ]
      const mockGetAllDeployed = mockFn().resolvesTo(deployedTokens)
      const mockGetAllAbstract = mockFn().resolvesTo(abstractTokens)
      const mockGetAllChains = mockFn().resolvesTo([])
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockGetAllDeployed,
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockGetAllAbstract,
        }),
        chain: mockObject<ChainRepository>({
          getAll: mockGetAllChains,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.all('bitcoin')

      expect(result.abstractTokens.length).toBeGreaterThan(0)
      expect(result.abstractTokens[0]?.symbol).toEqual('Bitcoin')
      expect(mockGetAllDeployed).toHaveBeenCalledWith()
      expect(mockGetAllAbstract).toHaveBeenCalledWith()
      expect(mockGetAllChains).toHaveBeenCalledWith()
    })

    it('returns empty arrays when no tokens exist', async () => {
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.all('test')

      expect(result).toEqual({
        deployedTokens: [],
        abstractTokens: [],
        chains: [],
      })
    })

    it('limits results to 15 items per type', async () => {
      const abstractTokens = Array.from({ length: 20 }, (_, i) => ({
        id: `TK${String(i).padStart(4, '0')}`,
        symbol: `Token${i}`,
        category: 'other' as const,
        issuer: null,
        coingeckoId: null,
        iconUrl: null,
        comment: null,
        coingeckoListingTimestamp: null,
        reviewed: false,
      }))
      const deployedTokens = Array.from({ length: 20 }, (_, i) => ({
        chain: 'ethereum',
        address: `0x${String(i).padStart(40, '0')}`,
        symbol: `Token${i}`,
        decimals: 18,
        comment: null,
        abstractTokenId: null,
        deploymentTimestamp: 0,
      }))
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo(deployedTokens),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo(abstractTokens),
        }),
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockDb)
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo(chains),
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.all('ethereum')

      expect(result.chains.length).toBeGreaterThan(0)
      expect(result.chains[0]?.name).toEqual('ethereum')
    })
  })
})

function createRouter(mockDb: TokenDatabase) {
  const callerFactory = createCallerFactory(searchRouter)
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    db: mockDb,
  })
}
