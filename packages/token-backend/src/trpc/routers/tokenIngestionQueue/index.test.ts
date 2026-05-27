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
      const entry = queueEntry({
        chain: 'ethereum',
        address: '0x111',
        state: 'staged',
      })
      const page = { entries: [entry], totalCount: 12 }
      const getPage = mockFn().resolvesTo(page)
      const deployedToken = mockObject<DeployedTokenRecord>({})
      const transferIndex = { findInvolving: mockFn().returns([]) }
      const getInteropTransferIndex = mockFn().resolvesTo(transferIndex)
      const plan = mockFn().resolvesTo({
        address: { chain: entry.chain, address: entry.address },
        steps: [],
        outcome: { kind: 'noop', deployedToken },
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

      expect(result.entries).toEqual([entry])
      expect(result.totalCount).toEqual(12)
      expect(result.predictedOutcomes).toEqual([
        {
          kind: 'noop',
          deployedToken,
          description: expect.a(String),
        },
      ])
      expect(getPage).toHaveBeenCalledWith({ offset: 5, limit: 5 })
      expect(getInteropTransferIndex).toHaveBeenCalledWith()
      expect(plan).toHaveBeenCalledTimes(1)
      expect(plan).toHaveBeenCalledWith(entry, transferIndex)
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
}): TokenIngestionQueueRecord {
  return {
    ...overrides,
    message: null,
    createdAt: UnixTime(1),
    updatedAt: UnixTime(1),
  }
}
