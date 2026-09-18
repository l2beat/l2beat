import type {
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function checkIfLivenessExists(
  projectId: ProjectId,
  subtype: TrackedTxsConfigSubtype,
  fromInclusive?: UnixTime,
): Promise<boolean> {
  if (env.MOCK) {
    return true
  }
  return await getDb().aggregatedLiveness.checkIfExists(
    projectId,
    subtype,
    fromInclusive,
  )
}
