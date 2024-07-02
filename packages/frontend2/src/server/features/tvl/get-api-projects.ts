import { type Project, bridges, layer2s, layer3s } from '@l2beat/config'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'

export interface ApiProject {
  id: ProjectId
  minTimestamp: UnixTime
  type: Project['type']
  slug: string
  sources: Map<
    string,
    {
      name: string
      minTimestamp: UnixTime
    }
  >
}

export function getApiProjects(configMapping: ConfigMapping): ApiProject[] {
  const projects = [...layer2s, ...layer3s, ...bridges]

  return projects.flatMap(({ id, type, display: { slug } }) => {
    const amounts = configMapping.getAmountsByProject(projectId)
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
