import type {
  Database,
  TokenDatabase,
  TokenIngestionQueueRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { TRPCError } from '@trpc/server'
import { describe, expect, it, vi } from 'vitest'
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
      const getAll = vi.fn().mockResolvedValue(entries)

      const caller = createRouter({
        tokenIngestionQueue: {
          getAll,
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      const result = await caller.getAll()

      expect(result).toStrictEqual(entries)
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
      const getPage = vi.fn().mockResolvedValue(page)
      const deployedToken = {} as unknown as DeployedTokenRecord
      const transferIndex = { findInvolving: vi.fn().mockReturnValue([]) }
      const getInteropTransferIndex = vi.fn().mockResolvedValue(transferIndex)
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
      const plan = vi
        .fn()
        .mockResolvedValueOnce({
          address: {
            chain: symbolConflictEntry.chain,
            address: symbolConflictEntry.address,
          },
          existingDeployedToken: deployedToken,
          steps: [],
          outcome: symbolConflictPlanOutcome,
        })
        .mockResolvedValueOnce({
          address: { chain: newEntry.chain, address: newEntry.address },
          existingDeployedToken: undefined,
          steps: [],
          outcome: { kind: 'noop', deployedToken },
        })
        .mockResolvedValueOnce({
          address: {
            chain: transferConflictEntry.chain,
            address: transferConflictEntry.address,
          },
          existingDeployedToken: deployedToken,
          steps: [],
          outcome: { kind: 'conflict', message: 'test conflict' },
        })

      const caller = createRouter({
        tokenDb: {
          tokenIngestionQueue: {
            getPage,
          } as unknown as TokenDatabase['tokenIngestionQueue'],
        } as unknown as TokenDatabase,
        processor: {
          getInteropTransferIndex,
          plan,
        } as unknown as TokenIngestionProcessor,
      })

      const result = await caller.getPage({ page: 2, pageSize: 5 })

      expect(result.totalCount).toStrictEqual(12)
      expect(result.rows).toStrictEqual([
        {
          entry: symbolConflictEntry,
          predictedOutcome: {
            ...symbolConflictPlanOutcome,
            description: expect.any(String),
          },
          deployedTokenExists: true,
          resolvableSymbolConflict: true,
        },
        {
          entry: newEntry,
          predictedOutcome: {
            kind: 'noop',
            deployedToken,
            description: expect.any(String),
          },
          deployedTokenExists: false,
          resolvableSymbolConflict: false,
        },
        {
          entry: transferConflictEntry,
          predictedOutcome: {
            kind: 'conflict',
            message: 'test conflict',
            description: expect.any(String),
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
      const transferIndex = { findInvolving: vi.fn().mockReturnValue([]) }
      const getInteropTransferIndex = vi.fn().mockResolvedValue(transferIndex)
      const trace = {
        id: 'ing_test',
        address: input,
        existingDeployedToken: undefined,
        steps: [],
        outcome: { kind: 'skip' as const, reason: 'test' },
      }
      const plan = vi.fn().mockResolvedValue(trace)
      const fetch = vi.fn().mockResolvedValue(trace)

      const caller = createRouter({
        tokenDb: {} as unknown as TokenDatabase,
        processor: {
          getInteropTransferIndex,
          plan,
          fetch,
        } as unknown as TokenIngestionProcessor,
      })

      const result = await caller.preview(input)

      expect(result.outcome).toMatchObject({
        kind: 'skip',
        reason: 'test',
        description: expect.any(String),
      })
      expect(getInteropTransferIndex).toHaveBeenCalledWith()
      expect(plan.mock.calls[0][0]).toMatchObject(input)
      expect(plan.mock.calls[0][1]).toStrictEqual(transferIndex)
      expect(fetch).toHaveBeenCalledWith(trace)
    })
  })

  describe('approve', () => {
    it('approves a staged entry', async () => {
      const approve = vi.fn().mockResolvedValue(1)
      const caller = createRouter({
        tokenIngestionQueue: {
          approve,
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      const input = { chain: 'ethereum', address: '0x111' }
      const result = await caller.approve(input)

      expect(result).toStrictEqual({ success: true })
      expect(approve).toHaveBeenCalledWith(input)
    })

    it('fails when the entry is not staged', async () => {
      const caller = createRouter({
        tokenIngestionQueue: {
          approve: vi.fn().mockResolvedValue(0),
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      await expect(
        caller.approve({ chain: 'ethereum', address: '0x111' }),
      ).rejects.toThrow(TRPCError)
    })
  })

  describe('approveMany', () => {
    it('approves supplied staged entries and returns the count', async () => {
      const approve = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0)
      const caller = createRouter({
        tokenIngestionQueue: {
          approve,
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      const first = { chain: 'ethereum', address: '0x111' }
      const second = { chain: 'base', address: '0x222' }
      const result = await caller.approveMany([first, second])

      expect(result).toStrictEqual({ success: true, approved: 1 })
      expect(approve).toHaveBeenCalledTimes(2)
      expect(approve.mock.calls[0][0]).toStrictEqual(first)
      expect(approve.mock.calls[1][0]).toStrictEqual(second)
    })
  })

  describe('retry', () => {
    it('retries a conflict or error entry', async () => {
      const retry = vi.fn().mockResolvedValue(1)
      const caller = createRouter({
        tokenIngestionQueue: {
          retry,
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      const input = { chain: 'ethereum', address: '0x111' }
      const result = await caller.retry(input)

      expect(result).toStrictEqual({ success: true })
      expect(retry).toHaveBeenCalledWith(input)
    })

    it('fails when the entry is not in conflict or error', async () => {
      const caller = createRouter({
        tokenIngestionQueue: {
          retry: vi.fn().mockResolvedValue(0),
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      await expect(
        caller.retry({ chain: 'ethereum', address: '0x111' }),
      ).rejects.toThrow(TRPCError)
    })
  })

  describe('retryMany', () => {
    it('retries supplied entries and returns the count', async () => {
      const retry = vi.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0)
      const caller = createRouter({
        tokenIngestionQueue: {
          retry,
        } as unknown as TokenDatabase['tokenIngestionQueue'],
      } as unknown as TokenDatabase)

      const first = { chain: 'ethereum', address: '0x111' }
      const second = { chain: 'base', address: '0x222' }
      const result = await caller.retryMany([first, second])

      expect(result).toStrictEqual({ success: true, retried: 1 })
      expect(retry).toHaveBeenCalledTimes(2)
      expect(retry.mock.calls[0][0]).toStrictEqual(first)
      expect(retry.mock.calls[1][0]).toStrictEqual(second)
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
    db: config.db ?? ({} as unknown as Database),
    tokenDb: config.tokenDb,
    tokenIngestionProcessor:
      config.processor ?? ({} as unknown as TokenIngestionProcessor),
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
