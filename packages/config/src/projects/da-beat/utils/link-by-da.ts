import type { ProjectId } from '@l2beat/shared-pure'
import type { Layer2, Layer3 } from '../../../types'
import { layer2s } from '../../layer2s'
import { layer3s } from '../../layer3s'
import { toUsedInProject } from './to-used-in-project'

/**
 * Helper function to select the layer2s and layer3s that use a specific layer and bridge
 * @notice Utilizes `dataAvailability` field from layer2s and layer3s
 */
export function linkByDA(where: {
  layer: ProjectId
  bridge: ProjectId | undefined
}) {
  return toUsedInProject(
    [...layer2s, ...layer3s]
      .filter((project: Layer2 | Layer3) => {
        return (
          !project.isArchived &&
          !project.isUpcoming &&
          where.layer === project.dataAvailability?.layer.projectId &&
          where.bridge === project.dataAvailability.bridge.projectId
        )
      })
      .sort((a, b) => a.display.name.localeCompare(b.display.name)),
  )
}
