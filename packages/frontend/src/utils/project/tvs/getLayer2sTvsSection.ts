import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2sTvsSectionProps } from '~/components/projects/sections/tvs/Layer2sTvsSection'
import { checkIfTvsExist } from '~/server/features/layer2s/tvs/utils/checkIfTvsExist'
import { optionToRange } from '~/utils/range/range'

export async function getLayer2sTvsSection(
  project: Project<never, 'archivedAt'>,
): Promise<Pick<Layer2sTvsSectionProps, 'defaultRange'> | undefined> {
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
