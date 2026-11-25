import type {
  ActivityRecord,
  Database,
  SyncMetadataRecord,
} from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getActivityData } from './getActivityData'

// Why: the range ends at the newest target of all activity indexers, which
// moves on with the clock even when a project stops syncing. The days after a
// project's last synced day used to come back as 0 transactions, which reads
// as "nobody used it". A synced day with no record really is 0: indexers
// write a day only when it had blocks.
// How: getActivityData runs over a fake database with a fixed target and
// per-project sync metadata; the tests read the counts it returns per day.
describe(getActivityData.name, () => {
  const TODAY = UnixTime.toStartOf(UnixTime.now(), 'day')
  const DAY = UnixTime.DAY
  const RANGE_END = TODAY - DAY
  const ALPHA = ProjectId('alpha')
  const BETA = ProjectId('beta')

  it('returns nulls for days after the project last synced', async () => {
    const db = mockDb(
      [activity(ALPHA, RANGE_END - 3 * DAY, 5)],
      [sync(ALPHA, { syncedUntil: RANGE_END - 2 * DAY + 10 * UnixTime.HOUR })],
    )

    const result = await getActivityData(db, '30d', [ALPHA])

    expect(result).toEqual([
      { timestamp: RANGE_END - 3 * DAY, txCount: 5, uopsCount: 5 },
      { timestamp: RANGE_END - 2 * DAY, txCount: null, uopsCount: null },
      { timestamp: RANGE_END - DAY, txCount: null, uopsCount: null },
      { timestamp: RANGE_END, txCount: null, uopsCount: null },
    ])
  })

  it('keeps zero for a synced day without a record', async () => {
    const db = mockDb(
      [activity(ALPHA, RANGE_END - 2 * DAY, 5), activity(ALPHA, RANGE_END, 7)],
      [sync(ALPHA, { syncedUntil: TODAY + DAY })],
    )

    const result = await getActivityData(db, '30d', [ALPHA])

    expect(result[1]).toEqual({
      timestamp: RANGE_END - DAY,
      txCount: 0,
      uopsCount: 0,
    })
    expect(result[2]).toEqual({
      timestamp: RANGE_END,
      txCount: 7,
      uopsCount: 7,
    })
  })

  it('cuts a sum of projects at its most synced project', async () => {
    const db = mockDb(
      [activity(ALPHA, RANGE_END - DAY, 1), activity(BETA, RANGE_END - DAY, 2)],
      [
        sync(ALPHA, { syncedUntil: RANGE_END + UnixTime.HOUR }),
        sync(BETA, { syncedUntil: RANGE_END - 5 * DAY }),
      ],
    )

    const result = await getActivityData(db, '30d', [ALPHA, BETA])

    expect(result).toEqual([
      { timestamp: RANGE_END - DAY, txCount: 3, uopsCount: 3 },
      { timestamp: RANGE_END, txCount: null, uopsCount: null },
    ])
  })

  it('treats a chain without new blocks as synced', async () => {
    const db = mockDb(
      [activity(ALPHA, RANGE_END - DAY, 1)],
      [
        sync(ALPHA, {
          syncedUntil: RANGE_END - 10 * DAY,
          blockTarget: 100,
          blockSyncedUntil: 100,
        }),
      ],
    )

    const result = await getActivityData(db, '30d', [ALPHA])

    expect(result.at(-1)).toEqual({
      timestamp: RANGE_END,
      txCount: 0,
      uopsCount: 0,
    })
  })

  it('stops at the target of a chain whose own target fell behind', async () => {
    const db = mockDb(
      [activity(ALPHA, RANGE_END - 3 * DAY, 4)],
      [
        sync(ALPHA, {
          target: RANGE_END - DAY + UnixTime.HOUR,
          syncedUntil: RANGE_END - 10 * DAY,
          blockTarget: 100,
          blockSyncedUntil: 100,
        }),
      ],
    )

    const result = await getActivityData(db, '30d', [ALPHA])

    expect(result).toEqual([
      { timestamp: RANGE_END - 3 * DAY, txCount: 4, uopsCount: 4 },
      { timestamp: RANGE_END - 2 * DAY, txCount: 0, uopsCount: 0 },
      { timestamp: RANGE_END - DAY, txCount: null, uopsCount: null },
      { timestamp: RANGE_END, txCount: null, uopsCount: null },
    ])
  })

  function mockDb(
    records: ActivityRecord[],
    syncRecords: SyncMetadataRecord[],
  ) {
    return mockObject<Database>({
      activity: mockObject<Database['activity']>({
        getByProjectsAndTimeRange: mockFn().resolvesTo(records),
      }),
      syncMetadata: mockObject<Database['syncMetadata']>({
        // The day after RANGE_END: the range ends a full day before the target
        getMaxTargetForFeature: mockFn().resolvesTo(TODAY + 12 * UnixTime.HOUR),
        getByFeatureAndIds: mockFn().resolvesTo(syncRecords),
      }),
    })
  }

  function activity(
    projectId: ProjectId,
    timestamp: UnixTime,
    count: number,
  ): ActivityRecord {
    return { projectId, timestamp, count, uopsCount: null, start: 0, end: 0 }
  }

  function sync(
    id: ProjectId,
    opts: {
      syncedUntil: UnixTime
      target?: UnixTime
      blockTarget?: number
      blockSyncedUntil?: number
    },
  ): SyncMetadataRecord {
    return {
      feature: 'activity',
      id,
      target: opts.target ?? TODAY + DAY,
      syncedUntil: opts.syncedUntil,
      blockTarget: opts.blockTarget ?? null,
      blockSyncedUntil: opts.blockSyncedUntil ?? null,
    }
  }
})
