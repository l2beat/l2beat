import type { ConfigReader } from '../config/ConfigReader'

// Every project whose modelling cluster contains `project`, directly or
// through another project. A direct-only scan is not enough: `molten`
// references `blobstream`, which references `shared-sp1`, so a change in
// `shared-sp1` reaches `molten` two hops away.
export function findClusterConsumers(
  configReader: ConfigReader,
  project: string,
): string[] {
  const referencedBy = buildReverseReferences(configReader)

  const consumers = new Set<string>()
  const queue = [project]
  for (const current of queue) {
    for (const consumer of referencedBy.get(current) ?? []) {
      if (consumer === project || consumers.has(consumer)) {
        continue
      }
      consumers.add(consumer)
      queue.push(consumer)
    }
  }

  return [...consumers].sort()
}

function buildReverseReferences(
  configReader: ConfigReader,
): Map<string, string[]> {
  const referencedBy = new Map<string, string[]>()

  for (const project of configReader.readAllDiscoveredProjects()) {
    const discovery = configReader.readDiscovery(project)
    const targets = new Set<string>()
    for (const entry of discovery.entries) {
      if (entry.targetProject !== undefined) {
        targets.add(entry.targetProject)
      }
    }
    for (const target of targets) {
      const consumers = referencedBy.get(target)
      if (consumers === undefined) {
        referencedBy.set(target, [project])
      } else {
        consumers.push(project)
      }
    }
  }

  return referencedBy
}
