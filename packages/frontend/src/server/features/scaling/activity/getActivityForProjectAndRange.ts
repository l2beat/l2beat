import { ProjectId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

import { UnixTime } from '@l2beat/shared-pure'
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

  const db = getDb()
  const resolution = rangeToResolution(range)
  const [from, to] = getRangeWithMax(range, resolution)

  return db.activity.getByProjectAndTimeRange(ProjectId(projectId), [
    from ? UnixTime.toStartOf(from, 'day') : null,
    UnixTime.toStartOf(to, 'day'),
  ])
}
