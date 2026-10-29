import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TokenIngestionProcessor } from '../../../ingestion/TokenIngestionProcessor'
import { createCallerFactory } from '../../trpc'
import { tvsCoverageRouter } from './index'

const PADDED =
  '0x000000000000000000000000A0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

describe(tvsCoverageRouter.name, () => {
  it('stores and deletes dismissals under the normalized address', async () => {
    const repository = mockObject<TokenDatabase['tvsCoverageDismissal']>({
      upsert: mockFn().resolvesTo(undefined),
      delete: mockFn().resolvesTo(1),
    })
    const caller = createCaller(
      mockObject<TokenDatabase>({ tvsCoverageDismissal: repository }),
    )
    const key = { projectId: 'base', chain: 'base', address: PADDED }

    await caller.dismiss({ ...key, reason: 'spam' })
    await caller.restore(key)

    expect(repository.upsert).toHaveBeenOnlyCalledWith(
      expect.subset({ address: ADDRESS, dismissedBy: 'dev@l2beat.com' }),
    )
    expect(repository.delete).toHaveBeenOnlyCalledWith({
      ...key,
      address: ADDRESS,
    })
  })

  it('lists dismissals for the page to join onto rows', async () => {
    const record = {
      projectId: 'base',
      chain: 'base',
      address: ADDRESS,
      reason: 'spam' as const,
      comment: undefined,
      dismissedBy: 'dev@l2beat.com',
      dismissedAt: UnixTime(1),
    }
    const caller = createCaller(
      mockObject<TokenDatabase>({
        tvsCoverageDismissal: mockObject<TokenDatabase['tvsCoverageDismissal']>(
          { getAll: mockFn().resolvesTo([record]) },
        ),
      }),
    )

    expect(await caller.dismissals()).toEqual([record])
  })
})

function createCaller(tokenDb: TokenDatabase) {
  return createCallerFactory(tvsCoverageRouter(undefined))({
    db: mockObject<Database>({}),
    tokenDb,
    tokenIngestionProcessor: mockObject<TokenIngestionProcessor>({}),
    headers: new Headers(),
    session: { email: 'dev@l2beat.com', permissions: ['read', 'write'] },
  })
}
