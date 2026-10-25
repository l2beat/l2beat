import type { Database, TokenDatabase } from '@l2beat/database'
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
