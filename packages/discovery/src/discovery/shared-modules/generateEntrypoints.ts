import { writeFile } from 'fs/promises'
import { join } from 'path'
import type { ConfigReader } from '../config/ConfigReader'
import type { StructureEntry } from '../output/types'

const ENTRYPOINTS_FILENAME = 'entrypoints.json'

interface Entrypoints {
  project: string
  timestamp: number
  usedBlockNumbers: Record<string, number | undefined>
  entrypoints: Entrypoint[]
}

interface Entrypoint {
  address: StructureEntry['address']
  type: Omit<StructureEntry['type'], 'Reference'>
  name?: string
}

export async function generateEntrypoints(configReader: ConfigReader) {
  // Temporarily we only create entrypoints for shared projects
  const sharedProjects = configReader
    .readAllDiscoveredProjects()
    .filter(({ project }) => project.startsWith('shared-'))

  for (const { project, chains } of sharedProjects) {
    const entrypoints = generateEntrypointsForProject(
      project,
      chains,
      configReader,
    )
    const projectDir = configReader.getProjectPath(project)
    const outputFile = join(projectDir, ENTRYPOINTS_FILENAME)
    await writeFile(outputFile, JSON.stringify(entrypoints, null, 2))
  }
}

function generateEntrypointsForProject(
  project: string,
  chains: string[],
  configReader: ConfigReader,
): Entrypoints {
  const entrypoints: Entrypoint[] = []

  // TODO: this is temporary, until we have single disovered.json with one timestamp
  let timestamp = 0 // see TODO above
  const usedBlockNumbers: Record<string, number | undefined> = {}

  for (const chain of chains) {
    const discovery = configReader.readDiscovery(project, chain)

    // TODO: this is temporary, until we have single disovered.json with one timestamp
    timestamp = discovery.timestamp
    usedBlockNumbers[chain] = discovery.usedBlockNumbers[chain]

    discovery.entries
      .filter((e) => e.type !== 'Reference')
      .map((e) => ({
        address: e.address,
        type: e.type,
        ...(e.name && { name: e.name }),
      }))
      .forEach((e) => entrypoints.push(e))
  }
  return {
    project,
    timestamp,
    usedBlockNumbers,
    entrypoints,
  }
}
