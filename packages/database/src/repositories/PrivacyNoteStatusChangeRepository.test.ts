import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type PrivacyNoteStatusChangeRecord,
  PrivacyNoteStatusChangeRepository,
} from './PrivacyNoteStatusChangeRepository'

describeDatabase(PrivacyNoteStatusChangeRepository.name, (db) => {
  const repository = db.privacyNoteStatusChange
  const START = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('overwrites a status change re-indexed under the same transaction log', async () => {
    const initial = change('aaaaaaaaaaaa', 100, 1, START, false)
    await repository.upsertMany([initial])

    const updated = { ...initial, noteId: 7, active: true }
    expect(await repository.upsertMany([updated])).toEqual(1)
    expect(await repository.getAll()).toEqual([updated])
  })

  it('round-trips the largest uint32 note id', async () => {
    const maxUint32 = {
      ...change('aaaaaaaaaaaa', 100, 1, START, false),
      noteId: 4_294_967_295,
    }
    await repository.upsertMany([maxUint32])

    expect(await repository.getAll()).toEqual([maxUint32])
  })

  it('returns changes of the given projects in the half-open window, in chain order', async () => {
    await repository.upsertMany([
      change('aaaaaaaaaaaa', 101, 0, START + UnixTime.HOUR, true),
      change('aaaaaaaaaaaa', 100, 2, START, false),
      change('aaaaaaaaaaaa', 100, 1, START, true),
      change('aaaaaaaaaaaa', 99, 0, START - 1, false),
      change('aaaaaaaaaaaa', 102, 0, START + UnixTime.DAY, false),
      change('bbbbbbbbbbbb', 100, 3, START, false, 'project-b'),
    ])

    const result = await repository.getByProjectIds(
      ['project-a'],
      START,
      START + UnixTime.DAY,
    )

    expect(result.map((c) => [c.blockNumber, c.logIndex])).toEqual([
      [100, 1],
      [100, 2],
      [101, 0],
    ])
  })

  it('trims only the selected configuration within the inclusive time range', async () => {
    await repository.upsertMany([
      change('aaaaaaaaaaaa', 99, 0, START - 1, false),
      change('aaaaaaaaaaaa', 100, 0, START, false),
      change('aaaaaaaaaaaa', 101, 0, START + UnixTime.HOUR, false),
      change('aaaaaaaaaaaa', 102, 0, START + UnixTime.HOUR + 1, false),
      change('bbbbbbbbbbbb', 100, 0, START, false),
    ])

    expect(
      await repository.deleteByConfigInTimeRange(
        'aaaaaaaaaaaa',
        START,
        START + UnixTime.HOUR,
      ),
    ).toEqual(2)

    const remaining = await repository.getAll()
    expect(
      remaining.map((c) => [c.configurationId, c.blockNumber]),
    ).toEqualUnsorted([
      ['aaaaaaaaaaaa', 99],
      ['aaaaaaaaaaaa', 102],
      ['bbbbbbbbbbbb', 100],
    ])
  })

  it('wipes every status change of the given configurations', async () => {
    await repository.upsertMany([
      change('aaaaaaaaaaaa', 100, 0, START, false),
      change('bbbbbbbbbbbb', 100, 0, START, false),
      change('cccccccccccc', 100, 0, START, false),
    ])

    expect(
      await repository.deleteByConfigIds(['aaaaaaaaaaaa', 'bbbbbbbbbbbb']),
    ).toEqual(2)

    const remaining = await repository.getAll()
    expect(remaining.map((c) => c.configurationId)).toEqual(['cccccccccccc'])
  })
})

function change(
  configurationId: string,
  blockNumber: number,
  logIndex: number,
  timestamp: UnixTime,
  active: boolean,
  projectId = 'project-a',
): PrivacyNoteStatusChangeRecord {
  return {
    configurationId,
    projectId,
    noteId: 1,
    timestamp,
    blockNumber,
    txHash: `0x${blockNumber.toString(16).padStart(64, '0')}`,
    logIndex,
    active,
  }
}
