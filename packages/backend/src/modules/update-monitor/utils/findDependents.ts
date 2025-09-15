import type { ConfigReader } from '@l2beat/discovery'

export function findDependents(name: string, configReader: ConfigReader) {
  const allProjects = configReader.readAllDiscoveredProjects()
  const dependents: string[] = []

  for (const project of allProjects) {
    const config = configReader.readConfig(project)
    if (config.structure.sharedModules.includes(name)) {
      dependents.push(config.name)
    }
    const discovery = configReader.readDiscovery(project)
    if (discovery.entries.some((e) => e.targetProject === name)) {
      dependents.push(config.name)
    }
  }

  return dependents
}
