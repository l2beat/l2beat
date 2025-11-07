import type { TokenDatabase } from '@l2beat/database'
import type { AbstractTokenRepository } from '@l2beat/database/dist/repositories/AbstractTokenRepository'
import type { DeployedTokenRepository } from '@l2beat/database/dist/repositories/DeployedTokenRepository'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../protectedProcedure'
import { createSearchRouter } from './search'

describe(createSearchRouter.name, () => {
  describe('tokens', () => {
    it('returns deployed tokens matching exact address when input starts with 0x', async () => {
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
        {
          chain: 'arbitrum',
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          symbol: 'USDT',
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
      })

      const caller = createRouter(mockDb)
      const result = await caller.tokens(
        '0x1234567890123456789012345678901234567890',
      )

      expect(result).toEqual({
        deployedTokens: [deployedTokens[0]],
        abstractTokens: [],
      })
    })

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
      })

      const caller = createRouter(mockDb)
      const result = await caller.tokens(
        '0x0000000000000000000000000000000000000000',
      )

      expect(result).toEqual({
        deployedTokens: [],
        abstractTokens: [],
      })
    })

    it('returns fuzzy search results when input does not start with 0x', async () => {
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
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockGetAllDeployed,
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockGetAllAbstract,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.tokens('bitcoin')

      expect(result.abstractTokens.length).toBeGreaterThan(0)
      expect(result.abstractTokens[0]?.symbol).toEqual('Bitcoin')
      expect(mockGetAllDeployed).toHaveBeenCalledWith()
      expect(mockGetAllAbstract).toHaveBeenCalledWith()
    })

    it('returns empty arrays when no tokens exist', async () => {
      const mockDb = mockObject<TokenDatabase>({
        deployedToken: mockObject<DeployedTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
        abstractToken: mockObject<AbstractTokenRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.tokens('test')

      expect(result).toEqual({
        deployedTokens: [],
        abstractTokens: [],
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
      })

      const caller = createRouter(mockDb)
      const result = await caller.tokens('token')

      expect(result.abstractTokens.length).toBeLessThanOrEqual(15)
      expect(result.deployedTokens.length).toBeLessThanOrEqual(15)
    })
  })
})

function createRouter(mockDb: TokenDatabase) {
  const router = createSearchRouter({
    db: mockDb,
  })

  const callerFactory = createCallerFactory(router)
  return callerFactory({ headers: new Headers() })
}
