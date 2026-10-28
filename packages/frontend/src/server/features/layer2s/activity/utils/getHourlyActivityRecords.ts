import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import { getHourlyActivityWindow } from './getHourlyActivityWindow'

/**
 * The hours of the projects within the hourly window, without the projects
 * too far behind to wait for
 */
export async function getHourlyActivityRecords(
  projectIds: ProjectId[],
  range: ChartRange,
  options?: {
    /**
     * The only projects whose sync decides the window, however far behind.
     * All projects with hours by default, leaving out those too far behind
     */
    waitFor?: ProjectId[]
  },
) {
  const db = getDb()
  assert(range[0] !== null, 'Hourly range without a start')
  // Sync first: hours read after it hold at least what it claims, even if an
  // indexer saves a batch in between
  const syncMetadata = await db.syncMetadata.getByFeatureAndIds(
    'activity',
    options?.waitFor ?? projectIds,
  )
  // A day early too, so 1D and 7D keep their length while the sync is behind
  // the day the range ends on
  const records = await db.hourlyActivity.getByProjectsAndTimeRange(
    projectIds,
    [range[0] - UnixTime.DAY, range[1]],
  )
  // Projects indexed per day have no hours, so they can't hold the window back
  const withHours = new Set(records.map((r) => r.projectId))
  const window = getHourlyActivityWindow(
    range,
    syncMetadata.filter((m) => withHours.has(ProjectId(m.id))),
    { waitForAll: options?.waitFor !== undefined },
  )
  const behind = new Set(window.behind.map((p) => p.id))

  return {
    records: records.filter(
      (r) =>
        r.timestamp >= window.start &&
        r.timestamp <= window.end &&
        !behind.has(r.projectId),
    ),
    withHours,
    window,
  }
}
