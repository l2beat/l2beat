import type { ConfigReader } from '@l2beat/discovery'
import type { ApiProjectsResponse } from './types'

export function getProjects(configReader: ConfigReader) {
  const chains = configReader.readAllChains()
  const projectToChain = new Map<string, string[]>()
  for (const chain of chains) {
    const projects = configReader.readAllProjectsForChain(chain)
    for (const project of projects) {
      const projectChains = projectToChain.get(project) ?? []
      projectChains.push(chain)
      projectToChain.set(project, projectChains)
    }
  }

  const response: ApiProjectsResponse = [...projectToChain.entries()]
    .map(([name, chains]) => ({ name, chains }))
    .sort((a, b) => a.name.localeCompare(b.name))
  return response
}
