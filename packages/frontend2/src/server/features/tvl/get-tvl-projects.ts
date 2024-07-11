import {
  type BackendProject,
  bridgeToBackendProject,
  bridges,
  getTvlAmountsConfig,
  layer2ToBackendProject,
  layer2s,
  layer3ToBackendProject,
  layer3s,
} from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'

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

  const tvlAmounts = getTvlAmountsConfig(projects)

  return projects.flatMap(({ projectId, type, slug }) => {
    const amounts = tvlAmounts.filter((o) => o.project === projectId)
    if (!amounts) {
      return []
    }
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
