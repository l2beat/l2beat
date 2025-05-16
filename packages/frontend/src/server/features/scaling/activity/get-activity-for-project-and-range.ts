import { ProjectId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getRangeWithMax } from '~/utils/range/range'
import { type CostsTimeRange, rangeToResolution } from '../costs/utils/range'

export function getActivityForProjectAndRange(
  projectId: string,
  range: CostsTimeRange,
) {
  if (env.MOCK) {
    return []
  }

  return getCachedActivityForProjectAndRange(projectId, range)
}

const getCachedActivityForProjectAndRange = cache(
  async (projectId: string, timeRange: CostsTimeRange) => {
    const db = getDb()
    const resolution = rangeToResolution(timeRange)
    const [from, to] = getRangeWithMax(timeRange, resolution)

    return db.activity.getByProjectAndTimeRange(ProjectId(projectId), [
      from ? UnixTime.toStartOf(from, 'day') : null,
      UnixTime.toStartOf(to, 'day'),
    ])
  },
  ['summed-activity-for-project'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)
