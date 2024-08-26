import {
  ConfigMapping,
  type Layer2,
  type Layer3,
  getTvlAmountsConfig,
  getTvlPricesConfig,
  toBackendProject,
} from '@l2beat/config'
import { getTvlBreakdown } from './get-tvl-breakdown'

export type ProjectTvlBreakdown = Awaited<
  ReturnType<ReturnType<typeof getTvlBreakdown>>
>

export function getTvlBreakdownForProject(project: Layer2 | Layer3) {
  const backendProject = toBackendProject(project)

  // Phase this out - two variants - one hard for backend and one soft for frontend
  const amountsConfigs = getTvlAmountsConfig([backendProject])
  const priceConfigs = getTvlPricesConfig()

  const configMapping = new ConfigMapping(priceConfigs, amountsConfigs, [
    backendProject.projectId,
  ])

  return getTvlBreakdown({ configMapping })(backendProject.projectId)
}
