import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { L2TvsSectionProps } from '~/components/projects/sections/tvs/L2TvsSection'
import { checkIfTvsExist } from '~/server/features/layer2s/tvs/utils/checkIfTvsExist'
import { optionToRange } from '~/utils/range/range'

export async function getL2TvsSection(
  project: Project<never, 'archivedAt'>,
): Promise<Pick<L2TvsSectionProps, 'defaultRange'> | undefined> {
  const hasData = await checkIfTvsExist(
    project.id,
    !project.archivedAt ? UnixTime.now() - 365 * UnixTime.DAY : undefined,
  )

  if (!hasData) {
    return undefined
  }

  return {
    defaultRange: project.archivedAt
      ? optionToRange('max')
      : optionToRange('1y'),
  }
}
