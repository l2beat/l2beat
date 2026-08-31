import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type PrivacyAnonymitySetEventRecord,
  PrivacyAnonymitySetEventRepository,
} from './PrivacyAnonymitySetEventRepository'

describeDatabase(PrivacyAnonymitySetEventRepository.name, (db) => {
  const repository = db.privacyAnonymitySetEvent
  const START = UnixTime.fromDate(new Date('2026-08-20T00:00:00Z'))

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('upserts records idempotently', async () => {
    const initial = event('aaaaaaaaaaaa', 1, START, 'alice', 10n)
    await repository.upsertMany([initial])

    const updated = { ...initial, sender: 'bob', amount: 20n }
    expect(await repository.upsertMany([updated])).toEqual(1)
    expect(await repository.getAll()).toEqual([updated])
  })

  it('groups to the maximum individual amount per sender and UTC day', async () => {
    await repository.upsertMany([
      event('aaaaaaaaaaaa', 1, START, 'alice', 6n),
      event('aaaaaaaaaaaa', 2, START + UnixTime.HOUR, 'alice', 10n),
      event('aaaaaaaaaaaa', 3, START, 'bob', 9n),
      event('aaaaaaaaaaaa', 4, START + UnixTime.DAY, 'carol', 100n),
      event('bbbbbbbbbbbb', 5, START, 'other-project', 100n, 'project-b'),
    ])

    const result = await repository.getSenderDaysByProjectIds(
      ['project-a'],
      START,
      START + UnixTime.DAY,
    )

    expect(result).toEqualUnsorted([
      {
        projectId: 'project-a',
        bucketId: 'bucket-a',
        timestamp: START,
        sender: 'alice',
        maximumAmount: 10n,
      },
      {
        projectId: 'project-a',
        bucketId: 'bucket-a',
        timestamp: START,
        sender: 'bob',
        maximumAmount: 9n,
      },
    ])
  })

  it('trims only the selected configuration and inclusive time range', async () => {
    await repository.upsertMany([
      event('aaaaaaaaaaaa', 1, START, 'alice', 1n),
      event('aaaaaaaaaaaa', 2, START + UnixTime.HOUR, 'bob', 1n),
      event('aaaaaaaaaaaa', 3, START + 2 * UnixTime.HOUR, 'carol', 1n),
      event('bbbbbbbbbbbb', 4, START, 'dave', 1n),
    ])

    expect(
      await repository.deleteByConfigInTimeRange(
        'aaaaaaaaaaaa',
        START,
        START + UnixTime.HOUR,
      ),
    ).toEqual(2)

    expect(await repository.getAll()).toEqualUnsorted([
      event('aaaaaaaaaaaa', 3, START + 2 * UnixTime.HOUR, 'carol', 1n),
      event('bbbbbbbbbbbb', 4, START, 'dave', 1n),
    ])
  })
})

function event(
  configurationId: string,
  logIndex: number,
  timestamp: UnixTime,
  sender: string,
  amount: bigint,
  projectId = 'project-a',
): PrivacyAnonymitySetEventRecord {
  return {
    configurationId,
    projectId,
    bucketId: 'bucket-a',
    chain: 'ethereum',
    timestamp,
    blockNumber: 100 + logIndex,
    txHash: `0x${logIndex.toString(16).padStart(64, '0')}`,
    logIndex,
    sender,
    amount,
  }
}
