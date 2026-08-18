import type {
  Database,
  TokenDatabase,
  TokenIngestionQueueRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TRPCError } from '@trpc/server'
import { expect, mockFn, mockObject } from 'earl'
import type { TokenIngestionProcessor } from '../../../ingestion/TokenIngestionProcessor'
import type { DeployedTokenRecord } from '../../../schemas/DeployedToken'
import { createCallerFactory } from '../../trpc'
import { tokenIngestionQueueRouter } from './index'

describe('tokenIngestionQueueRouter', () => {
  describe('getAll', () => {
    it('returns all queue entries', async () => {
      const entries: TokenIngestionQueueRecord[] = [
        queueEntry({ chain: 'ethereum', address: '0x111', state: 'staged' }),
        queueEntry({ chain: 'base', address: '0x222', state: 'conflict' }),
      ]
      const getAll = mockFn().resolvesTo(entries)

      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              getAll,
            },
          ),
        }),
      )

      const result = await caller.getAll()

      expect(result).toEqual(entries)
      expect(getAll).toHaveBeenCalledWith()
    })
  })

  describe('getPage', () => {
    it('returns one page of queue entries with predicted outcomes', async () => {
      const symbolConflictEntry = queueEntry({
        chain: 'ethereum',
        address: '0x111',
        state: 'conflict',
        message:
          'CoinGecko would create abstract token ABC123:WKAS, but the deployed token symbol is KAS.',
      })
      const newEntry = queueEntry({
        chain: 'base',
        address: '0x222',
        state: 'staged',
      })
      const transferConflictEntry = queueEntry({
        chain: 'ethereum',
        address: '0x333',
        state: 'conflict',
        message:
          'Non-swapping transfers point to abstract token USDC01:USDC, but the deployed token symbol is WETH.',
      })
      const page = {
        entries: [symbolConflictEntry, newEntry, transferConflictEntry],
        totalCount: 12,
      }
      const getPage = mockFn().resolvesTo(page)
      const deployedToken = mockObject<DeployedTokenRecord>({})
      const transferIndex = { findInvolving: mockFn().returns([]) }
      const getInteropTransferIndex = mockFn().resolvesTo(transferIndex)
      // A CoinGecko-symbol conflict only fires while the plan wants to build
      // a new abstract token from CoinGecko — the flag is derived from that.
      const symbolConflictPlanOutcome = {
        kind: 'pending' as const,
        operation: 'update' as const,
        existing: deployedToken,
        abstract: {
          kind: 'new-coingecko' as const,
          coingeckoId: 'wrapped-kaspa',
          symbol: 'wkas',
        },
        symbolFallback: 'WKAS',
        neighborsToEnqueue: [],
        proof: { kind: 'coingecko' as const },
      }
      const plan = mockFn()
        .resolvesToOnce({
          address: {
            chain: symbolConflictEntry.chain,
            address: symbolConflictEntry.address,
          },
          existingDeployedToken: deployedToken,
          steps: [],
          outcome: symbolConflictPlanOutcome,
        })
        .resolvesToOnce({
          address: { chain: newEntry.chain, address: newEntry.address },
          existingDeployedToken: undefined,
          steps: [],
          outcome: { kind: 'noop', deployedToken },
        })
        .resolvesToOnce({
          address: {
            chain: transferConflictEntry.chain,
            address: transferConflictEntry.address,
          },
          existingDeployedToken: deployedToken,
          steps: [],
          outcome: { kind: 'conflict', message: 'test conflict' },
        })

      const caller = createRouter({
        tokenDb: mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              getPage,
            },
          ),
        }),
        processor: mockObject<TokenIngestionProcessor>({
          getInteropTransferIndex,
          plan,
        }),
      })

      const result = await caller.getPage({ page: 2, pageSize: 5 })

      expect(result.totalCount).toEqual(12)
      expect(result.rows).toEqual([
        {
          entry: symbolConflictEntry,
          predictedOutcome: {
            ...symbolConflictPlanOutcome,
            description: expect.a(String),
          },
          deployedTokenExists: true,
          resolvableSymbolConflict: true,
        },
        {
          entry: newEntry,
          predictedOutcome: {
            kind: 'noop',
            deployedToken,
            description: expect.a(String),
          },
          deployedTokenExists: false,
          resolvableSymbolConflict: false,
        },
        {
          entry: transferConflictEntry,
          predictedOutcome: {
            kind: 'conflict',
            message: 'test conflict',
            description: expect.a(String),
          },
          deployedTokenExists: true,
          resolvableSymbolConflict: false,
        },
      ])
      expect(getPage).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
        chains: undefined,
      })
      expect(getInteropTransferIndex).toHaveBeenCalledWith()
      expect(plan).toHaveBeenCalledTimes(3)
      expect(plan).toHaveBeenNthCalledWith(
        1,
        symbolConflictEntry,
        transferIndex,
      )
      expect(plan).toHaveBeenNthCalledWith(2, newEntry, transferIndex)
      expect(plan).toHaveBeenNthCalledWith(
        3,
        transferConflictEntry,
        transferIndex,
      )
    })
  })

  describe('preview', () => {
    it('uses the cached interop transfer index with plan and fetch', async () => {
      const input = { chain: 'ethereum', address: '0x111' }
      const transferIndex = { findInvolving: mockFn().returns([]) }
      const getInteropTransferIndex = mockFn().resolvesTo(transferIndex)
      const trace = {
        id: 'ing_test',
        address: input,
        existingDeployedToken: undefined,
        steps: [],
        outcome: { kind: 'skip' as const, reason: 'test' },
      }
      const plan = mockFn().resolvesTo(trace)
      const fetch = mockFn().resolvesTo(trace)

      const caller = createRouter({
        tokenDb: mockObject<TokenDatabase>({}),
        processor: mockObject<TokenIngestionProcessor>({
          getInteropTransferIndex,
          plan,
          fetch,
        }),
      })

      const result = await caller.preview(input)

      expect(result.outcome).toHaveSubset({
        kind: 'skip',
        reason: 'test',
        description: expect.a(String),
      })
      expect(getInteropTransferIndex).toHaveBeenCalledWith()
      expect(plan.calls[0]?.args[0]).toHaveSubset(input)
      expect(plan.calls[0]?.args[1]).toEqual(transferIndex)
      expect(fetch).toHaveBeenCalledWith(trace)
    })
  })

  describe('approve', () => {
    it('approves a staged entry', async () => {
      const approve = mockFn().resolvesTo(1)
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              approve,
            },
          ),
        }),
      )

      const input = { chain: 'ethereum', address: '0x111' }
      const result = await caller.approve(input)

      expect(result).toEqual({ success: true })
      expect(approve).toHaveBeenCalledWith(input)
    })

    it('fails when the entry is not staged', async () => {
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              approve: mockFn().resolvesTo(0),
            },
          ),
        }),
      )

      await expect(
        caller.approve({ chain: 'ethereum', address: '0x111' }),
      ).toBeRejectedWith(TRPCError)
    })
  })

  describe('approveMany', () => {
    it('approves supplied staged entries and returns the count', async () => {
      const approve = mockFn().resolvesToOnce(1).resolvesToOnce(0)
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              approve,
            },
          ),
        }),
      )

      const first = { chain: 'ethereum', address: '0x111' }
      const second = { chain: 'base', address: '0x222' }
      const result = await caller.approveMany([first, second])

      expect(result).toEqual({ success: true, approved: 1 })
      expect(approve).toHaveBeenCalledTimes(2)
      expect(approve.calls[0]?.args[0]).toEqual(first)
      expect(approve.calls[1]?.args[0]).toEqual(second)
    })
  })

  describe('retry', () => {
    it('retries a conflict or error entry', async () => {
      const retry = mockFn().resolvesTo(1)
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              retry,
            },
          ),
        }),
      )

      const input = { chain: 'ethereum', address: '0x111' }
      const result = await caller.retry(input)

      expect(result).toEqual({ success: true })
      expect(retry).toHaveBeenCalledWith(input)
    })

    it('fails when the entry is not in conflict or error', async () => {
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              retry: mockFn().resolvesTo(0),
            },
          ),
        }),
      )

      await expect(
        caller.retry({ chain: 'ethereum', address: '0x111' }),
      ).toBeRejectedWith(TRPCError)
    })
  })

  describe('retryMany', () => {
    it('retries supplied entries and returns the count', async () => {
      const retry = mockFn().resolvesToOnce(1).resolvesToOnce(0)
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenDatabase['tokenIngestionQueue']>(
            {
              retry,
            },
          ),
        }),
      )

      const first = { chain: 'ethereum', address: '0x111' }
      const second = { chain: 'base', address: '0x222' }
      const result = await caller.retryMany([first, second])

      expect(result).toEqual({ success: true, retried: 1 })
      expect(retry).toHaveBeenCalledTimes(2)
      expect(retry.calls[0]?.args[0]).toEqual(first)
      expect(retry.calls[1]?.args[0]).toEqual(second)
    })
  })
})

function createRouter(
  deps:
    | TokenDatabase
    | {
        tokenDb: TokenDatabase
        db?: Database
        processor?: TokenIngestionProcessor
      },
) {
  const config =
    'tokenDb' in deps
      ? deps
      : { tokenDb: deps, db: undefined, processor: undefined }
  return createCallerFactory(tokenIngestionQueueRouter)({
    db: config.db ?? mockObject<Database>({}),
    tokenDb: config.tokenDb,
    tokenIngestionProcessor:
      config.processor ?? mockObject<TokenIngestionProcessor>({}),
    headers: new Headers(),
    session: {
      email: 'dev@l2beat.com',
      permissions: ['read', 'write'],
    },
  })
}

function queueEntry(overrides: {
  chain: string
  address: string
  state: TokenIngestionQueueRecord['state']
  message?: string
}): TokenIngestionQueueRecord {
  return {
    message: null,
    createdAt: UnixTime(1),
    updatedAt: UnixTime(1),
    ...overrides,
  }
}
