import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingTvsSectionProps } from '~/components/projects/sections/tvs/ScalingTvsSection'
import { checkIfTvsExist } from '~/server/features/scaling/tvs/utils/checkIfTvsExist'

export async function getScalingTvsSection(
  project: Project<never, 'archivedAt'>,
): Promise<Pick<ScalingTvsSectionProps, 'defaultRange'> | undefined> {
  const hasData = await checkIfTvsExist(
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
