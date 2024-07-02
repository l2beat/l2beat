import {
  type BackendProject,
  bridges,
  layer2s,
  layer3s,
  layer2ToBackendProject,
  layer3ToBackendProject,
  bridgeToBackendProject,
  getTvlAmountsConfig,
  getChainToProjectMapping,
} from '@l2beat/config'
import { type ProjectId, UnixTime, assert } from '@l2beat/shared-pure'

export interface TvlProject {
  id: ProjectId
  minTimestamp: UnixTime
  type: BackendProject['type']
  slug: string
  sources: Map<
    string,
    {
      name: string
      minTimestamp: UnixTime
    }
  >
}

export function getTvlProjects(): TvlProject[] {
  const projects = [
    ...layer2s.map(layer2ToBackendProject),
    ...layer3s.map(layer3ToBackendProject),
    ...bridges.map(bridgeToBackendProject),
  ]

  const chainToProject = getChainToProjectMapping()

  const tvlAmounts = getTvlAmountsConfig(projects, chainToProject)

  return projects.flatMap(({ projectId, type, slug }) => {
    const amounts = tvlAmounts.filter((o) => o.project === projectId)
    if (!amounts) {
      return []
    }
    assert(amounts, 'Config not found: ' + projectId.toString())
    const minTimestamp = amounts
      .map((x) => x.sinceTimestamp)
      .reduce((a, b) => UnixTime.min(a, b), UnixTime.now())

    const sources = new Map<string, { name: string; minTimestamp: UnixTime }>()
    for (const amount of amounts) {
      const name =
        amount.type === 'circulatingSupply' ? 'coingecko' : amount.chain

      const source = sources.get(name)
      if (!source || source.minTimestamp.gt(amount.sinceTimestamp)) {
        sources.set(name, { name, minTimestamp: amount.sinceTimestamp })
      }
    }
    return { id: projectId, minTimestamp, type, slug, sources }
  })
}
