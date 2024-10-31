import { type Layer2, type Layer3 } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { unstable_noStore as noStore } from 'next/cache'
import { db } from '~/server/database'
import { cache } from '~/utils/cache'
import { type TimeRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'

export function getLatestActivityForProjects(
  ...parameters: Parameters<typeof getCachedLatestActivityForProjects>
) {
  noStore()
  return getCachedLatestActivityForProjects(...parameters)
}

const getCachedLatestActivityForProjects = cache(
  async (projects: (Layer2 | Layer3)[], timeRange: TimeRange) => {
    const range = getFullySyncedActivityRange(timeRange)
    const summedCounts =
      await db.activity.getSummedCountForProjectsAndTimeRange(
        projects.map((p) => p.id),
        range,
      )

    return Object.fromEntries(
      summedCounts.map((record) => [record.projectId, record.count]),
    )
  },
  ['latestActivity'],
  { revalidate: UnixTime.HOUR },
)
