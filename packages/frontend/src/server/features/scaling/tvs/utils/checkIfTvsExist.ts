import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function checkIfTvsExist(projectId: string, from?: UnixTime) {
  if (env.MOCK) {
    return true
  }
  const db = getDb()
  return await db.tvsTokenValue.checkIfExists(projectId, from)
}
