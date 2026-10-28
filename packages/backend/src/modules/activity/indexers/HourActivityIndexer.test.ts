import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { LighterClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import range from 'lodash/range'
import { LighterDayProvider } from '../../../providers/day/LighterDayProvider'
import { describeDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { HourActivityIndexer } from './HourActivityIndexer'

const PROJECT = ProjectId('lighter')
const START = UnixTime.fromDate(new Date('2026-10-01T00:00:00Z'))
const TODAY = START + 15 * UnixTime.DAY
/** One hour a day before today, the oldest more than two weeks back */
const HISTORY = range(15).map((day) =>
  stat(START + day * UnixTime.DAY + 5 * UnixTime.HOUR, 10 + day, 1),
)

describeDatabase(HourActivityIndexer.name, (db) => {
  beforeEach(async () => {
    _TEST_ONLY_resetUniqueIds()
    await db.activity.deleteAll()
    await db.hourlyActivity.deleteAll()
    await db.syncMetadata.deleteAll()
    await db.syncMetadata.upsertMany([
      { feature: 'activity', id: PROJECT, target: TODAY },
    ])
  })

  it('syncs until the last full hour, rewriting today each hour', async () => {
    const getHourlyStats = mockFn()
      // Lighter gives its whole history, with the hour still going on
      .resolvesToOnce([
        ...HISTORY,
        stat(TODAY, 4, 40),
        stat(TODAY + 1 * UnixTime.HOUR, 6, 30),
        stat(TODAY + 2 * UnixTime.HOUR, 100, 100),
      ])
      .resolvesToOnce([
        ...HISTORY,
        stat(TODAY, 4, 40),
        stat(TODAY + 1 * UnixTime.HOUR, 7, 30),
        stat(TODAY + 2 * UnixTime.HOUR, 8, 50),
        stat(TODAY + 3 * UnixTime.HOUR, 100, 100),
      ])
    const indexer = createIndexer(db, getHourlyStats)

    const twoAm = toHeight(TODAY + 2 * UnixTime.HOUR)
    expect(await indexer.update(toHeight(START), twoAm)).toEqual(twoAm)

    expect(await getToday()).toEqual({ count: 10, uopsCount: 70 })
    expect(await getTodayPeak()).toEqual({
      peakHourCount: 6,
      peakHourUopsCount: 40,
    })
    expect(await getHoursOfToday()).toEqual([
      { count: 4, uopsCount: 40 },
      { count: 6, uopsCount: 30 },
    ])
    expect(await getSyncedUntil()).toEqual(TODAY + 2 * UnixTime.HOUR)

    const threeAm = toHeight(TODAY + 3 * UnixTime.HOUR)
    expect(await indexer.update(twoAm + 1, threeAm)).toEqual(threeAm)

    expect(await getToday()).toEqual({ count: 19, uopsCount: 120 })
    expect(await getTodayPeak()).toEqual({
      peakHourCount: 8,
      peakHourUopsCount: 50,
    })
    expect(await getHoursOfToday()).toEqual([
      { count: 4, uopsCount: 40 },
      { count: 7, uopsCount: 30 },
      { count: 8, uopsCount: 50 },
    ])
    expect(await getSyncedUntil()).toEqual(TODAY + 3 * UnixTime.HOUR)
  })

  it('keeps two weeks of hours, and every day', async () => {
    const indexer = createIndexer(
      db,
      mockFn().resolvesTo([...HISTORY, stat(TODAY, 4, 40)]),
    )

    await indexer.update(toHeight(START), toHeight(TODAY + UnixTime.HOUR))

    const days = await db.activity.getByProjectAndTimeRange(PROJECT, [
      null,
      TODAY,
    ])
    expect(days.map((day) => day.count)).toEqual([
      ...HISTORY.map((hour) => hour.count),
      4,
    ])
    const hours = await db.hourlyActivity.getByProjectAndTimeRange(PROJECT, [
      START,
      TODAY,
    ])
    expect(hours.map((hour) => hour.count)).toEqual([
      ...HISTORY.slice(1).map((hour) => hour.count),
      4,
    ])
  })

  it('syncs the hours of a day again after invalidating it', async () => {
    const indexer = createIndexer(
      db,
      mockFn().resolvesTo([
        ...HISTORY,
        stat(TODAY, 4, 40),
        stat(TODAY + 1 * UnixTime.HOUR, 6, 30),
      ]),
    )
    const twoAm = toHeight(TODAY + 2 * UnixTime.HOUR)
    await indexer.update(toHeight(START), twoAm)

    const oneAm = toHeight(TODAY + 1 * UnixTime.HOUR)
    expect(await indexer.invalidate(oneAm)).toEqual(oneAm)
    expect(await getHoursOfToday()).toEqual([{ count: 4, uopsCount: 40 }])

    await indexer.update(oneAm + 1, twoAm)

    expect(await getToday()).toEqual({ count: 10, uopsCount: 70 })
    expect(await getHoursOfToday()).toEqual([
      { count: 4, uopsCount: 40 },
      { count: 6, uopsCount: 30 },
    ])
  })

  it('throws when a day has no hours', async () => {
    const indexer = createIndexer(db, mockFn().resolvesTo([stat(TODAY, 4, 40)]))

    await expect(
      indexer.update(
        toHeight(TODAY - UnixTime.DAY) + 1,
        toHeight(TODAY + UnixTime.HOUR),
      ),
    ).toBeRejectedWith('Day has no hours')
  })

  async function getToday() {
    const [today] = await db.activity.getByProjectAndTimeRange(PROJECT, [
      TODAY,
      TODAY,
    ])
    return today && { count: today.count, uopsCount: today.uopsCount }
  }

  function getTodayPeak() {
    return db.activity['db']
      .selectFrom('Activity')
      .select(['peakHourCount', 'peakHourUopsCount'])
      .where('projectId', '=', PROJECT)
      .where('timestamp', '=', UnixTime.toDate(TODAY))
      .executeTakeFirst()
  }

  async function getHoursOfToday() {
    const hours = await db.hourlyActivity.getByProjectAndTimeRange(PROJECT, [
      TODAY,
      TODAY + UnixTime.DAY,
    ])
    return hours.map((hour) => ({
      count: hour.count,
      uopsCount: hour.uopsCount,
    }))
  }

  async function getSyncedUntil() {
    const record = await db.syncMetadata.getByFeatureAndId('activity', PROJECT)
    return record?.syncedUntil
  }
})

function createIndexer(
  db: Database,
  getHourlyStats: LighterClient['getHourlyStats'],
) {
  return new HourActivityIndexer(
    {
      projectId: PROJECT,
      minHeight: toHeight(START),
      parents: [],
      provider: new LighterDayProvider(
        mockObject<LighterClient>({ getHourlyStats }),
      ),
      indexerService: mockObject<IndexerService>({}),
      db,
    },
    Logger.SILENT,
  )
}

function toHeight(timestamp: UnixTime) {
  return timestamp / UnixTime.HOUR
}

function stat(timestamp: UnixTime, count: number, uopsCount: number) {
  return { timestamp, count, uopsCount }
}
