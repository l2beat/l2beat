import type { TokenDatabase } from '@l2beat/database'
import type {
  ChainRecord,
  ChainRepository,
} from '@l2beat/database/dist/repositories/ChainRepository'
import { expect, mockFn, mockObject } from 'earl'
import type { BlockscoutClient } from '../../chains/clients/blockscout/BlockscoutClient'
import type { EtherscanClient } from '../../chains/clients/etherscan/EtherscanClient'
import type { RpcClient } from '../../chains/clients/rpc/RpcClient'
import type { ChainUpdate } from '../../schemas/Chain'
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
          explorerUrl: 'https://etherscan.io',
          apis: [{ type: 'etherscan' }],
        },
        {
          name: 'arbitrum',
          chainId: 42161,
          aliases: ['arb'],
          explorerUrl: 'https://arbiscan.io',
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

  describe('getByName', () => {
    it('returns chain when it exists', async () => {
      const chain: ChainRecord = {
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth', 'mainnet'],
        explorerUrl: 'https://etherscan.io',
        apis: [{ type: 'etherscan' }],
      }
      const mockFindByName = mockFn().resolvesTo(chain)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          findByName: mockFindByName,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.getByName('ethereum')

      expect(result).toEqual(chain)
      expect(mockFindByName).toHaveBeenCalledWith('ethereum')
    })

    it('returns null when chain does not exist', async () => {
      const mockFindByName = mockFn().resolvesTo(undefined)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          findByName: mockFindByName,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.getByName('nonexistent')

      expect(result).toEqual(null)
      expect(mockFindByName).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('insert', () => {
    it('inserts a new chain', async () => {
      const chain: ChainRecord = {
        name: 'ethereum',
        chainId: 1,
        aliases: ['eth', 'mainnet'],
        explorerUrl: 'https://etherscan.io',
        apis: [{ type: 'etherscan' }],
      }
      const mockInsert = mockFn().resolvesTo(undefined)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          insert: mockInsert,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.insert(chain)

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith(chain)
    })

    it('inserts a chain with null fields', async () => {
      const chain: ChainRecord = {
        name: 'arbitrum',
        chainId: 42161,
        aliases: null,
        explorerUrl: null,
        apis: null,
      }
      const mockInsert = mockFn().resolvesTo(undefined)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          insert: mockInsert,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.insert(chain)

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith(chain)
    })

    it('inserts a chain with different API types', async () => {
      const chain: ChainRecord = {
        name: 'polygon',
        chainId: 137,
        aliases: ['matic'],
        explorerUrl: 'https://polygonscan.com',
        apis: [
          { type: 'rpc', url: 'https://rpc.polygon.io' },
          { type: 'blockscout', url: 'https://blockscout.com' },
          { type: 'blockscoutV2', url: 'https://blockscout-v2.com' },
          { type: 'routescan', url: 'https://routescan.io' },
        ],
      }
      const mockInsert = mockFn().resolvesTo(undefined)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          insert: mockInsert,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.insert(chain)

      expect(result).toEqual({ success: true })
      expect(mockInsert).toHaveBeenCalledWith(chain)
    })
  })

  describe('update', () => {
    it('updates chain fields', async () => {
      const update: ChainUpdate = {
        name: 'ethereum',
        chainId: 1,
        explorerUrl: 'https://new-explorer.io',
        aliases: ['eth', 'mainnet', 'ethereum-mainnet'],
        apis: [{ type: 'etherscan' }],
      }
      const mockUpdateByName = mockFn().resolvesTo(1)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          updateByName: mockUpdateByName,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.update({
        name: 'ethereum',
        update,
      })

      expect(result).toEqual(1)
      expect(mockUpdateByName).toHaveBeenCalledWith('ethereum', update)
    })

    it('updates only specific fields', async () => {
      const update: ChainUpdate = {
        name: 'ethereum',
        explorerUrl: 'https://updated-explorer.io',
      }
      const mockUpdateByName = mockFn().resolvesTo(1)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          updateByName: mockUpdateByName,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.update({
        name: 'ethereum',
        update,
      })

      expect(result).toEqual(1)
      expect(mockUpdateByName).toHaveBeenCalledWith('ethereum', update)
    })

    it('updates chain with null values', async () => {
      const update: ChainUpdate = {
        name: 'arbitrum',
        aliases: null,
        explorerUrl: null,
        apis: null,
      }
      const mockUpdateByName = mockFn().resolvesTo(1)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          updateByName: mockUpdateByName,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.update({
        name: 'arbitrum',
        update,
      })

      expect(result).toEqual(1)
      expect(mockUpdateByName).toHaveBeenCalledWith('arbitrum', update)
    })
  })

  describe('delete', () => {
    it('deletes an existing chain', async () => {
      const mockDeleteByName = mockFn().resolvesTo(1)
      const mockDb = mockObject<TokenDatabase>({
        chain: mockObject<ChainRepository>({
          deleteByName: mockDeleteByName,
        }),
      })

      const caller = createRouter(mockDb)
      const result = await caller.delete({ name: 'ethereum' })

      expect(result).toEqual(1)
      expect(mockDeleteByName).toHaveBeenCalledWith('ethereum')
    })
  })

  describe('testApi', () => {
    describe('rpc', () => {
      it('returns success when RPC API is working', async () => {
        const mockRpcClient = mockObject<RpcClient>({
          test: mockFn().resolvesTo({ success: true }),
        })

        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouter(mockDb, {
          createRpcClient: () => mockRpcClient,
        })
        const result = await caller.testApi({
          type: 'rpc',
          url: 'https://rpc.example.com',
        })

        expect(result).toEqual({ success: true })
        expect(mockRpcClient.test).toHaveBeenCalledWith()
      })

      it('returns failure when RPC API returns error', async () => {
        const mockRpcClient = mockObject<RpcClient>({
          test: mockFn().resolvesTo({
            success: false,
            error: 'Error message',
          }),
        })

        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouter(mockDb, {
          createRpcClient: () => mockRpcClient,
        })
        const result = await caller.testApi({
          type: 'rpc',
          url: 'https://rpc.example.com',
        })

        expect(result).toEqual({ success: false, error: 'Error message' })
      })
    })

    describe('blockscout', () => {
      it('returns success when Blockscout API is working', async () => {
        const mockBlockscoutClient = mockObject<BlockscoutClient>({
          test: mockFn().resolvesTo({ success: true }),
        })

        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouter(mockDb, {
          createBlockscoutClient: () => mockBlockscoutClient,
        })
        const result = await caller.testApi({
          type: 'blockscout',
          url: 'https://blockscout.example.com',
        })

        expect(result).toEqual({ success: true })
        expect(mockBlockscoutClient.test).toHaveBeenCalledWith()
      })

      it('returns failure when Blockscout API returns error', async () => {
        const mockBlockscoutClient = mockObject<BlockscoutClient>({
          test: mockFn().resolvesTo({
            success: false,
            error: 'Error message',
          }),
        })

        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouter(mockDb, {
          createBlockscoutClient: () => mockBlockscoutClient,
        })
        const result = await caller.testApi({
          type: 'blockscout',
          url: 'https://blockscout.example.com',
        })

        expect(result).toEqual({ success: false, error: 'Error message' })
      })
    })

    describe('etherscan', () => {
      it('returns success when Etherscan API is working', async () => {
        const mockEtherscanClient = mockObject<EtherscanClient>({
          test: mockFn().resolvesTo({ success: true }),
        })

        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouterWithEtherscanKey(mockDb, 'test-api-key', {
          createEtherscanClient: () => mockEtherscanClient,
        })
        const result = await caller.testApi({
          type: 'etherscan',
          chainId: 1,
        })

        expect(result).toEqual({ success: true })
        expect(mockEtherscanClient.test).toHaveBeenCalledWith()
      })

      it('returns failure when API key is not configured', async () => {
        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouter(mockDb)
        const result = await caller.testApi({
          type: 'etherscan',
          chainId: 1,
        })

        expect(result).toEqual({
          success: false,
          error: 'API key not configured',
        })
      })

      it('returns failure when Etherscan API returns error', async () => {
        const mockEtherscanClient = mockObject<EtherscanClient>({
          test: mockFn().resolvesTo({
            success: false,
            error: 'Error message',
          }),
        })

        const mockDb = mockObject<TokenDatabase>({
          chain: mockObject<ChainRepository>({}),
        })

        const caller = createRouterWithEtherscanKey(mockDb, 'test-api-key', {
          createEtherscanClient: () => mockEtherscanClient,
        })
        const result = await caller.testApi({
          type: 'etherscan',
          chainId: 1,
        })

        expect(result).toEqual({ success: false, error: 'Error message' })
      })
    })
  })
})

function createRouter(
  mockDb: TokenDatabase,
  clientFactories?: {
    createRpcClient?: (config: { url: string }) => RpcClient
    createBlockscoutClient?: (config: { url: string }) => BlockscoutClient
    createEtherscanClient?: (
      config: { apiKey: string },
      chainId: number,
    ) => EtherscanClient
  },
) {
  const callerFactory = createCallerFactory(
    chainsRouter({
      etherscanApiKey: undefined,
      ...clientFactories,
    }),
  )
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    db: mockDb,
  })
}

function createRouterWithEtherscanKey(
  mockDb: TokenDatabase,
  etherscanApiKey: string,
  clientFactories?: {
    createRpcClient?: (config: { url: string }) => RpcClient
    createBlockscoutClient?: (config: { url: string }) => BlockscoutClient
    createEtherscanClient?: (
      config: { apiKey: string },
      chainId: number,
    ) => EtherscanClient
  },
) {
  const callerFactory = createCallerFactory(
    chainsRouter({
      etherscanApiKey,
      ...clientFactories,
    }),
  )
  return callerFactory({
    headers: new Headers(),
    session: {
      email: 'test@example.com',
      permissions: ['read', 'write'],
    },
    db: mockDb,
  })
}
