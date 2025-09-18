import type { ProjectId } from '@l2beat/shared-pure'
import type { ScalingProject } from '../internalTypes'
import { layer2s } from '../processing/layer2s'
import { layer3s } from '../processing/layer3s'
import { asArray } from '../templates/utils'
import type { UsedInProject } from '../types'

/**
 * Helper function to select the layer2s and layer3s that use a specific layer and bridge
 * @notice Utilizes `dataAvailability` field from layer2s and layer3s
 */
export function linkByDA(where: {
  layer: ProjectId
  bridge: ProjectId | undefined
}): UsedInProject[] {
  return [...layer2s, ...layer3s]
    .filter((project: ScalingProject) => {
      const das = asArray(project.dataAvailability)
      return (
        !project.archivedAt &&
        !project.isUpcoming &&
        das.some(
          (da) =>
            where.layer === da.layer.projectId &&
            where.bridge === da.bridge.projectId,
        )
      )
    })
    .sort((a, b) => a.display.name.localeCompare(b.display.name))
    .map((project) => ({
      id: project.id,
      name: project.display.name,
      slug: project.display.slug,
    }))
}
