import type { TokenDatabase } from '@l2beat/database'
import type {
  ChainRecord,
  ChainRepository,
} from '@l2beat/database/dist/repositories/ChainRepository'
import { expect, mockFn, mockObject } from 'earl'
import type { Config } from '../../config/Config'
import { createCallerFactory } from '../trpc'
import { chainsRouter } from './chains'

describe('chainRouter', () => {
  describe('getAll', () => {
    it('returns empty array when no chains exist', async () => {
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockFn().resolvesTo([]),
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.getAll()

      expect(result).toEqual([])
    })

    it('returns all chains', async () => {
      const chains: ChainRecord[] = [
        {
          name: 'ethereum',
          chainId: 1,
          aliases: ['eth'],
          apis: [{ type: 'etherscan' }],
        },
        {
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          apis: [{ type: 'etherscan' }],
        },
      ]
      const mockGetAll = mockFn().resolvesTo(chains)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          getAll: mockGetAll,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.getAll()

      expect(result).toEqual(chains)
      expect(mockGetAll).toHaveBeenCalledWith()
    })
  })
})

function createRouter(mockDb: TokenDatabase) {
  const callerFactory = createCallerFactory(chainsRouter)
  return callerFactory({
    headers: new Headers(),
    config: mockObject<Config>({ auth: false }),
    db: mockDb,
  })
}
