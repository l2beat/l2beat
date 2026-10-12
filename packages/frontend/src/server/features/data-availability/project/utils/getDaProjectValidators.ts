import type { DaValidators } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getDaProjectValidators(
  projectId: ProjectId,
  validatorsConfig: DaValidators | undefined,
): Promise<number | undefined> {
  if (!validatorsConfig) {
    return undefined
  }

  if (env.MOCK) {
    return 100
  }
  const db = getDb()

  if (validatorsConfig.type === 'static') {
    return validatorsConfig.count
  }

  const daBeatStats = await db.daBeatStats.findById(projectId)
  if (!daBeatStats?.numberOfValidators) {
    return undefined
  }

  return daBeatStats.numberOfValidators
}
