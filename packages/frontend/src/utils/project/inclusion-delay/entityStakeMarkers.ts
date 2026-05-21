import type {
  ProjectInclusionDelayConfig,
  ProjectInclusionDelayEntityStake,
} from '@l2beat/config'

import { calculateProjectDelaySeconds } from './calculateProjectDelay'
import type { EntityStakeMarker } from './types'

export function getEntityStakeMarkers(
  config: ProjectInclusionDelayConfig,
): EntityStakeMarker[] {
  const distribution = config.entityStakeDistribution
  if (
    !distribution ||
    !Number.isFinite(distribution.totalStake) ||
    distribution.totalStake <= 0
  ) {
    return []
  }

  const entities = getSortedPositiveEntities(distribution.entities)

  let cumulativeStake = 0
  const entityNames: string[] = []
  const markers: EntityStakeMarker[] = []

  for (const [i, entity] of entities.entries()) {
    cumulativeStake += entity.stake
    entityNames.push(entity.name)

    const stakeFraction = cumulativeStake / distribution.totalStake
    const delaySeconds =
      stakeFraction <= config.maxCensoringFraction
        ? calculateProjectDelaySeconds(
            config,
            Math.round(config.validatorCount * stakeFraction),
          )
        : null

    const entityCount = i + 1
    markers.push({
      id: `${entityCount}-${entity.name}`,
      label: `Top ${entityCount}`,
      entityCount,
      entityNames: [...entityNames],
      stakeFraction,
      delaySeconds,
    })

    if (delaySeconds === null) break
  }

  return markers
}

function getSortedPositiveEntities(
  entities: ProjectInclusionDelayEntityStake[],
) {
  return [...entities]
    .filter((entity) => Number.isFinite(entity.stake) && entity.stake > 0)
    .sort((a, b) => b.stake - a.stake)
}
