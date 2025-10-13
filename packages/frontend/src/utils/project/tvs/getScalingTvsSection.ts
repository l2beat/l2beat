import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingTvsSectionProps } from '~/components/projects/sections/ScalingTvsSection'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getScalingTvsSection(
  project: Project<never, 'archivedAt'>,
): Promise<Pick<ScalingTvsSectionProps, 'defaultRange'> | undefined> {
  if (env.MOCK) {
    return {
      defaultRange: '1y',
    }
  }

  const db = getDb()
  const hasData = await db.tvsTokenValue.checkIfExists(
    project.id,
    !project.archivedAt ? UnixTime.now() - 365 * UnixTime.DAY : undefined,
  )

  if (!hasData) {
    return undefined
  }

  return {
    defaultRange: project.archivedAt ? 'max' : '1y',
  }
}
