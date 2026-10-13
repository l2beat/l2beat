import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { THROUGHPUT_ENABLED_DA_LAYERS } from './consts'

export async function checkIfDataPostedExists(
  projectId: ProjectId,
  fromInclusive?: UnixTime,
): Promise<boolean> {
  if (env.MOCK) {
    return true
  }
  return await getDb().dataAvailability.checkIfExists(
    projectId,
    THROUGHPUT_ENABLED_DA_LAYERS,
    fromInclusive,
  )
}
