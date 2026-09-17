import type {
  Database,
  TokenDatabase,
  TokenDbHistoryEntryRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { TokenIngestionProcessor } from '../../../ingestion/TokenIngestionProcessor'
import { createCallerFactory } from '../../trpc'
import { tokenDbHistoryRouter } from './index'

describe('tokenDbHistoryRouter', () => {
  describe('getPage', () => {
    it('returns one page of history entries', async () => {
      const entry: TokenDbHistoryEntryRecord = {
        id: '1',
        timestamp: UnixTime(1),
        source: 'manual',
        userEmail: 'dev@l2beat.com',
        commandType: 'AddAbstractTokenCommand',
        command: { type: 'AddAbstractTokenCommand' },
        intent: null,
        ingestionLog: null,
      }
      const page = { entries: [entry], totalCount: 12 }
      const getPage = vi.fn().mockResolvedValue(page)

      const caller = createCallerFactory(tokenDbHistoryRouter)({
        db: {} as unknown as Database,
        tokenDb: {
          tokenDbHistory: {
            getPage,
          } as unknown as TokenDatabase['tokenDbHistory'],
        } as unknown as TokenDatabase,
        tokenIngestionProcessor: {} as unknown as TokenIngestionProcessor,
        headers: new Headers(),
        session: {
          email: 'dev@l2beat.com',
          permissions: ['read', 'write'],
        },
      })

      const result = await caller.getPage({ page: 2, pageSize: 5 })

      expect(result).toStrictEqual(page)
      expect(getPage).toHaveBeenCalledWith({
        offset: 5,
        limit: 5,
        search: undefined,
      })

      await caller.getPage({ page: 1, pageSize: 5, search: 'usdc' })

      expect(getPage).toHaveBeenCalledWith({
        offset: 0,
        limit: 5,
        search: 'usdc',
      })
    })
  })
})
