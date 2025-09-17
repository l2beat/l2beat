import type { ConfigReader } from '@l2beat/discovery'

export function findDependents(name: string, configReader: ConfigReader) {
  const dependents: string[] = []
  const allProjects = configReader.readAllDiscoveredProjects()

  for (const project of allProjects) {
    const discovery = configReader.readDiscovery(project)
    const isReferenced = discovery.entries.some((e) => e.targetProject === name)
    if (isReferenced) {
      dependents.push(discovery.name)
    }
  }

  return dependents
}
