import type { TokenDatabase } from '@l2beat/database'
import type {
  TokenIngestionQueueRecord,
  TokenIngestionQueueRepository,
} from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import { UnixTime } from '@l2beat/shared-pure'
import { TRPCError } from '@trpc/server'
import { expect, mockFn, mockObject } from 'earl'
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
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            getAll,
          }),
        }),
      )

      const result = await caller.getAll()

      expect(result).toEqual(entries)
      expect(getAll).toHaveBeenCalledWith()
    })
  })

  describe('getPage', () => {
    it('returns one page of queue entries', async () => {
      const page = {
        entries: [
          queueEntry({ chain: 'ethereum', address: '0x111', state: 'staged' }),
        ],
        totalCount: 12,
      }
      const getPage = mockFn().resolvesTo(page)

      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            getPage,
          }),
        }),
      )

      const result = await caller.getPage({ page: 2, pageSize: 5 })

      expect(result).toEqual(page)
      expect(getPage).toHaveBeenCalledWith({ offset: 5, limit: 5 })
    })
  })

  describe('approve', () => {
    it('approves a staged entry', async () => {
      const approve = mockFn().resolvesTo(1)
      const caller = createRouter(
        mockObject<TokenDatabase>({
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            approve,
          }),
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
          tokenIngestionQueue: mockObject<TokenIngestionQueueRepository>({
            approve: mockFn().resolvesTo(0),
          }),
        }),
      )

      await expect(
        caller.approve({ chain: 'ethereum', address: '0x111' }),
      ).toBeRejectedWith(TRPCError)
    })
  })
})

function createRouter(tokenDb: TokenDatabase) {
  return createCallerFactory(tokenIngestionQueueRouter)({
    db: {} as never,
    tokenDb,
    tokenIngestionProcessor: {} as never,
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
