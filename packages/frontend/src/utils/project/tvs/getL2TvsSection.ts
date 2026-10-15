import type { Project } from '@l2beat/config'
import type { L2TvsSectionProps } from '~/components/projects/sections/tvs/L2TvsSection'
import { checkIfTvsExist } from '~/server/features/layer2s/tvs/utils/checkIfTvsExist'
import { optionToRange } from '~/utils/range/range'

export async function getL2TvsSection(
  project: Project<never, 'archivedAt'>,
): Promise<Pick<L2TvsSectionProps, 'defaultRange'> | undefined> {
  const defaultRange = project.archivedAt
    ? optionToRange('max')
    : optionToRange('1y')
  const hasData = await checkIfTvsExist(
    project.id,
    defaultRange[0] ?? undefined,
  )

  if (!hasData) {
    return undefined
  }

  return { defaultRange }
}
