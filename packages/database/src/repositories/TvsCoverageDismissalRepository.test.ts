import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeTokenDatabase } from '../test/tokenDatabase'
import {
  type TvsCoverageDismissalRecord,
  TvsCoverageDismissalRepository,
} from './TvsCoverageDismissalRepository'

describeTokenDatabase(TvsCoverageDismissalRepository.name, (db) => {
  const repository = db.tvsCoverageDismissal

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts, lists and deletes dismissals by project and token', async () => {
    await repository.upsert(dismissal({ reason: 'spam' }))
    await repository.upsert(
      dismissal({
        address: '0xABC',
        reason: 'doubleCounted',
        comment: 'vault',
        dismissedBy: 'other@l2beat.com',
        dismissedAt: UnixTime(2_000),
      }),
    )
    await repository.upsert(dismissal({ projectId: 'base', reason: 'spam' }))

    expect(await repository.getAll()).toEqualUnsorted([
      dismissal({
        reason: 'doubleCounted',
        comment: 'vault',
        dismissedBy: 'other@l2beat.com',
        dismissedAt: UnixTime(2_000),
      }),
      dismissal({ projectId: 'base', reason: 'spam' }),
    ])

    expect(
      await repository.delete({
        projectId: 'arbitrum',
        chain: 'arbitrum',
        address: '0xAbc',
      }),
    ).toEqual(1)
    expect(await repository.getAll()).toEqual([
      dismissal({ projectId: 'base', reason: 'spam' }),
    ])
  })

  it('deletes only the dismissal with the same project, chain and address', async () => {
    const others = [
      dismissal({ projectId: 'base' }),
      dismissal({ chain: 'ethereum' }),
      dismissal({ address: '0xdef' }),
    ]
    for (const record of [dismissal({}), ...others]) {
      await repository.upsert(record)
    }

    expect(
      await repository.delete({
        projectId: 'arbitrum',
        chain: 'arbitrum',
        address: '0xabc',
      }),
    ).toEqual(1)
    expect(await repository.getAll()).toEqualUnsorted(others)
  })
})

function dismissal(
  overrides: Partial<TvsCoverageDismissalRecord>,
): TvsCoverageDismissalRecord {
  return {
    projectId: 'arbitrum',
    chain: 'arbitrum',
    address: '0xabc',
    reason: 'notRelevant',
    comment: undefined,
    dismissedBy: 'researcher@l2beat.com',
    dismissedAt: UnixTime(1_000),
    ...overrides,
  }
}
