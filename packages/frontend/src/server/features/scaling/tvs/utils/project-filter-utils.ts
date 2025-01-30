import type { Bridge, Layer2, Layer3 } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { z } from 'zod'
import { isProjectOther } from '../../utils/is-project-other'

export const TvsProjectFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum([
      'layer2',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'bridge',
    ]),
  }),
  z.object({
    type: z.literal('projects'),
    projectIds: z.array(z.string()),
  }),
])
export type TvsProjectFilter = z.infer<typeof TvsProjectFilter>

export function createTvsProjectsFilter(
  filter: TvsProjectFilter,
  previewRecategorisation?: boolean,
): (project: Layer2 | Layer3 | Bridge) => boolean {
  switch (filter.type) {
    case 'layer2':
    case 'bridge':
      return (project) => project.type === filter.type
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.id)
    case 'rollups':
      return (project) =>
        !isProjectOther(project, previewRecategorisation) &&
        !(previewRecategorisation && project.isUnderReview) && // If previewRecategorisation is true, we exclude projects that are under review
        (project.display.category === 'Optimistic Rollup' ||
          project.display.category === 'ZK Rollup')
    case 'validiumsAndOptimiums':
      return (project) =>
        !isProjectOther(project, previewRecategorisation) &&
        !(previewRecategorisation && project.isUnderReview) &&
        (project.display.category === 'Validium' ||
          project.display.category === 'Optimium' ||
          project.display.category === 'Plasma')
    case 'others':
      return (project) =>
        isProjectOther(project, previewRecategorisation) &&
        !(previewRecategorisation && project.isUnderReview)
    default:
      assertUnreachable(filter)
  }
}
