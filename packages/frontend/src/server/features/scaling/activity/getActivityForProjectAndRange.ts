import { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { CostsTimeRange } from '../costs/utils/range'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export function getActivityForProjectAndRange(
  projectId: string,
  range: CostsTimeRange,
) {
  if (env.MOCK) {
    return []
  }

  const db = getDb()
  const fullySyncedRange = getFullySyncedActivityRange({ type: range })

  return db.activity.getByProjectAndTimeRange(
    ProjectId(projectId),
    fullySyncedRange,
  )
}
