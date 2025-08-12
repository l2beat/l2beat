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
  chain: string,
  project: string,
) {
  const entrypoints = generateEntrypointsForProject(
    project,
    chain,
    configReader,
  )
  const projectDir = configReader.getProjectPath(project)
  const outputFile = join(projectDir, ENTRYPOINTS_FILENAME)
  await writeFile(outputFile, JSON.stringify(entrypoints, null, 2))
}

function generateEntrypointsForProject(
  project: string,
  chain: string,
  configReader: ConfigReader,
): Entrypoints {
  const discovery = configReader.readDiscovery(project, chain)
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
