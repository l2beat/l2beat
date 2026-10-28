import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type LiquidStakingSnapshotRecord,
  LiquidStakingSnapshotRepository,
} from './LiquidStakingSnapshotRepository'

describeDatabase(LiquidStakingSnapshotRepository.name, (db) => {
  const repository = db.liquidStakingSnapshot

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('upserts by configuration and timestamp, keeping bigints exact', async () => {
    await repository.upsertMany([record('a', 1), record('b', 1)])
    const updated = {
      ...record('a', 1),
      exchangeRate: 1_234_567_890_123_456_789_012n,
      instantExitEth: 5n,
    }
    await repository.upsertMany([updated])

    expect(await repository.getAll()).toEqualUnsorted([updated, record('b', 1)])
  })

  it('gets the projects in a range, oldest first', async () => {
    await repository.upsertMany([
      record('a', 3),
      record('a', 1),
      record('b', 2),
      record('a', 9),
    ])

    expect(
      await repository.getByProjectsInRange(
        ['project-a', 'project-b'],
        UnixTime(UnixTime.HOUR),
        UnixTime(3 * UnixTime.HOUR),
      ),
    ).toEqual([record('a', 1), record('b', 2), record('a', 3)])
  })

  it('deletes by configuration and by time range', async () => {
    await repository.upsertMany([
      record('a', 1),
      record('a', 2),
      record('a', 3),
      record('b', 1),
    ])

    expect(
      await repository.deleteByConfigInTimeRange(
        'a'.repeat(12),
        UnixTime(2 * UnixTime.HOUR),
        UnixTime(3 * UnixTime.HOUR),
      ),
    ).toEqual(2)
    expect(await repository.deleteByConfigIds(['b'.repeat(12)])).toEqual(1)
    expect(await repository.getAll()).toEqual([record('a', 1)])
  })
})

function record(
  configuration: 'a' | 'b',
  hour: number,
): LiquidStakingSnapshotRecord {
  return {
    // Configuration ids are 12 characters, like the column.
    configurationId: configuration.repeat(12),
    projectId: `project-${configuration}`,
    timestamp: UnixTime(hour * UnixTime.HOUR),
    blockNumber: hour,
    exchangeRate: 10n ** 18n,
    lastRequestId: 10,
    lastFinalizedRequestId: 8,
    instantExitEth: null,
    lockTime: null,
  }
}
