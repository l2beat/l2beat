import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type PrivacyNoteRecord,
  PrivacyNoteRepository,
} from './PrivacyNoteRepository'

describeDatabase(PrivacyNoteRepository.name, (db) => {
  const repository = db.privacyNote
  const START = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('overwrites a note deposited again under the same configuration and note id', async () => {
    const initial = note('aaaaaaaaaaaa', 1, START, 10n)
    await repository.upsertMany([initial])

    const updated = {
      ...initial,
      txHash: `0x${'f'.repeat(64)}`,
      amount: 20n,
      expiresAt: START + 2 * UnixTime.DAY,
    }
    expect(await repository.upsertMany([updated])).toEqual(1)
    expect(await repository.getAll()).toEqual([updated])
  })

  it('round-trips the largest uint32 note id', async () => {
    const maxUint32 = note('aaaaaaaaaaaa', 4_294_967_295, START, 1n)
    await repository.upsertMany([maxUint32])

    expect(await repository.getAll()).toEqual([maxUint32])
  })

  it('returns notes of the given projects in the half-open window, ordered by timestamp then note id', async () => {
    await repository.upsertMany([
      note('aaaaaaaaaaaa', 4, START + UnixTime.HOUR, 1n),
      note('aaaaaaaaaaaa', 3, START, 1n),
      note('aaaaaaaaaaaa', 2, START, 1n),
      note('aaaaaaaaaaaa', 1, START - 1, 1n),
      note('aaaaaaaaaaaa', 5, START + UnixTime.DAY, 1n),
      note('bbbbbbbbbbbb', 6, START, 1n, 'project-b'),
    ])

    const result = await repository.getByProjectIds(
      ['project-a'],
      START,
      START + UnixTime.DAY,
    )

    expect(result.map((n) => n.noteId)).toEqual([2, 3, 4])
  })

  it('trims only the selected configuration within the inclusive time range', async () => {
    await repository.upsertMany([
      note('aaaaaaaaaaaa', 1, START - 1, 1n),
      note('aaaaaaaaaaaa', 2, START, 1n),
      note('aaaaaaaaaaaa', 3, START + UnixTime.HOUR, 1n),
      note('aaaaaaaaaaaa', 4, START + UnixTime.HOUR + 1, 1n),
      note('bbbbbbbbbbbb', 5, START, 1n),
    ])

    expect(
      await repository.deleteByConfigInTimeRange(
        'aaaaaaaaaaaa',
        START,
        START + UnixTime.HOUR,
      ),
    ).toEqual(2)

    const remaining = await repository.getAll()
    expect(remaining.map((n) => n.noteId)).toEqualUnsorted([1, 4, 5])
  })

  it('wipes every note of the given configurations', async () => {
    await repository.upsertMany([
      note('aaaaaaaaaaaa', 1, START, 1n),
      note('bbbbbbbbbbbb', 1, START, 1n),
      note('cccccccccccc', 1, START, 1n),
    ])

    expect(
      await repository.deleteByConfigIds(['aaaaaaaaaaaa', 'bbbbbbbbbbbb']),
    ).toEqual(2)

    const remaining = await repository.getAll()
    expect(remaining.map((n) => n.configurationId)).toEqual(['cccccccccccc'])
  })
})

function note(
  configurationId: string,
  noteId: number,
  timestamp: UnixTime,
  amount: bigint,
  projectId = 'project-a',
): PrivacyNoteRecord {
  return {
    configurationId,
    projectId,
    noteId,
    timestamp,
    txHash: `0x${noteId.toString(16).padStart(64, '0')}`,
    amount,
    expiresAt: timestamp + UnixTime.DAY,
  }
}
