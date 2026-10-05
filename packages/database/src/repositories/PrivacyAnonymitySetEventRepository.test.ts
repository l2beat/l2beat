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

  it('stores note events in chain order, excludes them from depositor counts and trims lifecycle changes', async () => {
    const deposit = {
      ...event('aaaaaaaaaaaa', 1, START, 'alice', 10n),
      sender: null,
      note: {
        id: 4_294_967_295,
        active: true,
        expiresAt: UnixTime(START + 30 * UnixTime.DAY),
      },
    }
    const escapeEvent = {
      ...event('aaaaaaaaaaaa', 2, START + UnixTime.HOUR, 'alice', 0n),
      sender: null,
      note: { id: deposit.note.id, active: false, expiresAt: null },
    }
    await repository.upsertMany([escapeEvent, deposit])
    expect(
      await repository.getNoteEventsByProjectIds(
        ['project-a'],
        START,
        START + UnixTime.DAY,
      ),
    ).toEqual([deposit, escapeEvent])
    expect(
      await repository.getSenderDaysByProjectIds(
        ['project-a'],
        START,
        START + UnixTime.DAY,
      ),
    ).toEqual([])
    await repository.deleteByConfigInTimeRange(
      'aaaaaaaaaaaa',
      UnixTime(START + UnixTime.HOUR),
      UnixTime(START + UnixTime.DAY),
    )
    expect(
      await repository.getNoteEventsByProjectIds(
        ['project-a'],
        START,
        START + UnixTime.DAY,
      ),
    ).toEqual([deposit])
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

  it('counts deposits into the given project buckets within the half-open window', async () => {
    await repository.upsertMany([
      event('aaaaaaaaaaaa', 1, START - 1, 'alice', 10n),
      event('aaaaaaaaaaaa', 2, START, 'alice', 10n),
      event('aaaaaaaaaaaa', 3, START + UnixTime.HOUR, 'alice', 10n),
      event('aaaaaaaaaaaa', 4, START + UnixTime.DAY, 'alice', 10n),
      event('bbbbbbbbbbbb', 5, START, 'bob', 10n, 'project-b'),
      { ...event('cccccccccccc', 6, START, 'carol', 10n), bucketId: 'other' },
    ])

    expect(
      await repository.getDepositCount(
        'project-a',
        ['bucket-a'],
        START,
        START + UnixTime.DAY,
      ),
    ).toEqual(2)
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
