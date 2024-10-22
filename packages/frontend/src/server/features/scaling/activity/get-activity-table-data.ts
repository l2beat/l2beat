import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { countToUops } from './utils/count-to-uops'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayRatio } from './utils/get-last-day-ratio'
import { getLastDayUops } from './utils/get-last-day-uops'
import { getUopsWeeklyChange } from './utils/get-uops-weekly-change'
import { sumActivityCount } from './utils/sum-activity-count'

export async function getActivityTableData(projects: (Layer2 | Layer3)[]) {
  if (env.MOCK) {
    return getMockActivityTableData()
  }
  noStore()
  return getCachedActivityTableData(projects)
}

export type ActivityProjectTableData = NonNullable<ActivityTableData[string]>
type ActivityTableData = Awaited<ReturnType<typeof getCachedActivityTableData>>

const getCachedActivityTableData = cache(
  async (projects: (Layer2 | Layer3)[]) => {
    const range = getFullySyncedActivityRange('30d')
    const records = await db.activity.getByProjectsAndTimeRange(
      [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
      range,
    )
    const maxUopsCounts = await db.activity.getMaxUopsCountForProjects()

    const grouped = groupBy(records, (r) => r.projectId)

    const data = Object.fromEntries(
      Object.entries(grouped).map(([projectId, records]) => {
        const lastRecord = records.at(-1)

        if (!lastRecord) {
          return [projectId, undefined]
        }

        const maxUopsCount = maxUopsCounts[projectId]
        assert(
          maxUopsCount !== undefined,
          `Max UOPS count for project ${projectId} not found`,
        )

        return [
          projectId,
          {
            change: getUopsWeeklyChange(records),
            pastDayUops: getLastDayUops(records),
            maxUops: {
              value: countToUops(maxUopsCount.uopsCount),
              timestamp: maxUopsCount.timestamp.toNumber(),
            },
            summedCount: sumActivityCount(records),
            ratio: getLastDayRatio(records),
            syncStatus: getSyncStatus(lastRecord.timestamp),
          },
        ]
      }),
    )

    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value),
    )
  },
  ['activityTable'],
  {
    revalidate: 10 * UnixTime.MINUTE,
  },
)

function getSyncStatus(syncedUntil: UnixTime) {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  return { isSynced, syncedUntil: syncedUntil.toNumber() }
}

function getMockActivityTableData(): ActivityTableData {
  const projects = [
    { id: ProjectId.ETHEREUM },
    ...layer2s.filter((l2) => !l2.isArchived && !l2.isUpcoming),
    ...layer3s.filter((l3) => !l3.isUpcoming),
  ]

  return Object.fromEntries(
    projects.map((project) => [
      project.id,
      {
        change: Math.random(),
        pastDayUops: 20,
        maxUops: {
          value: 30,
          timestamp: UnixTime.now().toNumber(),
        },
        ratio: 1.1,
        summedCount: 1500,
        syncStatus: getSyncStatus(UnixTime.now()),
      },
    ]),
  )
}
