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

export async function generateEntrypoints(
  configReader: ConfigReader,
  project: string,
) {
  const entrypoints = generateEntrypointsForProject(project, configReader)
  const projectDir = configReader.getProjectPath(project)
  const outputFile = join(projectDir, ENTRYPOINTS_FILENAME)
  await writeFile(outputFile, JSON.stringify(entrypoints, null, 2))
}

function generateEntrypointsForProject(
  project: string,
  configReader: ConfigReader,
): Entrypoints {
  const discovery = configReader.readDiscovery(project)
  const entrypoints: Entrypoint[] = discovery.entries
    .filter((e) => e.type !== 'Reference')
    .map((e) => ({
      address: e.address,
      type: e.type,
      ...(e.name && { name: e.name }),
    }))

  return {
    project,
    timestamp: discovery.timestamp,
    usedBlockNumbers: discovery.usedBlockNumbers,
    entrypoints,
  }
}
