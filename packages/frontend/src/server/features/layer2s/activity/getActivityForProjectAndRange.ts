import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export async function getActivityForProjectAndRange(
  projectId: string,
  range: ChartRange,
) {
  if (env.MOCK) {
    return []
  }

  const db = getDb()
  const fullySyncedRange = await getFullySyncedActivityRange(range)

  return db.activity.getByProjectAndTimeRange(
    ProjectId(projectId),
    fullySyncedRange,
  )
}
