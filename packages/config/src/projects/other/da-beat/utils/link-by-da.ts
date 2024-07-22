import { Layer2, layer2s } from '../../../layer2s'
import { Layer3, layer3s } from '../../../layer3s'
import { toUsedInProject } from './to-used-in-project'

/**
 * Helper function to select the layer2s and layer3s that use a specific layer and bridge
 * @notice Utilizes `dataAvailability` field from layer2s and layer3s
 */
export function linkByDA(where: {
  layer: (value: string | undefined) => boolean | undefined
  bridge?: (value: string | undefined) => boolean | undefined
}) {
  const filterFn = ({ dataAvailability }: Layer2 | Layer3) => {
    return where.bridge
      ? where.layer(dataAvailability?.layer.value) &&
          where.bridge(dataAvailability?.bridge.value)
      : where.layer(dataAvailability?.layer.value)
  }

  return toUsedInProject(
    [...layer2s, ...layer3s]
      .filter(filterFn)
      .filter((project) => !project.isArchived),
  )
}
