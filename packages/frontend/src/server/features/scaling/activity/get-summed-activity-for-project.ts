import { ProjectId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'

export function getSummedActivityForProject(
  projectId: string,
  range: [UnixTime | null, UnixTime] | undefined,
) {
  if (env.MOCK) {
    return 10000
  }

  return getCachedSummedActivityForProject(projectId, range)
}

const getCachedSummedActivityForProject = cache(
  async (projectId: string, range: [UnixTime | null, UnixTime] | undefined) => {
    if (!range) {
      return 0
    }
    const db = getDb()
    const [from, to] = range
    return db.activity.getSummedUopsCountForProjectAndTimeRange(
      ProjectId(projectId),
      [
        from ? UnixTime.toStartOf(from, 'day') : null,
        UnixTime.toStartOf(to, 'day'),
      ],
    )
  },
  ['summed-activity-for-project'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)
