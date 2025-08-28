import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import type { ConfigReader } from '../config/ConfigReader'
import type { Entrypoint } from '../config/StructureConfig'

const ENTRYPOINTS_FILENAME = 'entrypoints.json'

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
) {
  const discovery = configReader.readDiscovery(project, chain)
  const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {}
  discovery.entries
    .filter((e) => e.type !== 'Reference')
    .forEach((e) => {
      entrypoints[e.address] = {
        ...(e.name && { name: e.name }),
        type: e.type.toString(),
        project,
      }
    })

  return { entrypoints }
}
