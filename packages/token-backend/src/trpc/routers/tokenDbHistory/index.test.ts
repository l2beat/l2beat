import type {
  Database,
  TokenDatabase,
  TokenDbHistoryEntryRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
      const getPage = mockFn().resolvesTo(page)

      const caller = createCallerFactory(tokenDbHistoryRouter)({
        db: mockObject<Database>({}),
        tokenDb: mockObject<TokenDatabase>({
          tokenDbHistory: mockObject<TokenDatabase['tokenDbHistory']>({
            getPage,
          }),
        }),
        tokenIngestionProcessor: mockObject<TokenIngestionProcessor>({}),
        headers: new Headers(),
        session: {
          email: 'dev@l2beat.com',
          permissions: ['read', 'write'],
        },
      })

      const result = await caller.getPage({ page: 2, pageSize: 5 })

      expect(result).toEqual(page)
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
