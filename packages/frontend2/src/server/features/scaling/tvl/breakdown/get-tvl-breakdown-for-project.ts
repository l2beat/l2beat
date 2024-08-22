import {
  ConfigMapping,
  bridgeToBackendProject,
  bridges,
  getTvlAmountsConfig,
  getTvlPricesConfig,
  layer2ToBackendProject,
  layer2s,
  layer3ToBackendProject,
  layer3s,
} from '@l2beat/config'
import { type ProjectId } from '@l2beat/shared-pure'
import { getTvlBreakdown } from './get-tvl-breakdown'

export function getTvlBreakdownForProject(projectId: ProjectId) {
  // Try to filter single project for the data view
  const projects = [
    ...layer2s.map(layer2ToBackendProject),
    ...layer3s.map(layer3ToBackendProject),
    ...bridges.map(bridgeToBackendProject),
  ]

  const filteredProjects = projects.filter((p) => p.projectId === projectId)

  // Phase this out
  const amountsConfigs = getTvlAmountsConfig(filteredProjects).filter(
    (c) => c.project === projectId,
  )
  const priceConfigs = getTvlPricesConfig()

  const configMapping = new ConfigMapping(
    priceConfigs,
    amountsConfigs,
    filteredProjects.map((p) => p.projectId),
  )

  return getTvlBreakdown({ configMapping })()
}
