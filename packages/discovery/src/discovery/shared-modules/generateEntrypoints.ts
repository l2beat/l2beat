import { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import type { ConfigReader } from '../config/ConfigReader'
import type { Entrypoint } from '../config/StructureConfig'

const ENTRYPOINTS_FILENAME = 'entrypoints.json'

export async function generateEntrypoints(
  configReader: ConfigReader,
  project: string,
  logger: Logger = Logger.DEBUG,
  options: { updateOnly?: boolean } = {},
) {
  const projectDir = configReader.getProjectPath(project)
  const outputFilePath = join(projectDir, ENTRYPOINTS_FILENAME)
  if (options.updateOnly && !fileExistsCaseSensitive(outputFilePath)) {
    logger.info("Skipping update of entrypoints.json (file doesn't exist).")
    return
  }
  logger.info(`Generating entrypoints.json for project ${project}`)
  const entrypoints = generateEntrypointsForProject(project, configReader)
  await writeFile(outputFilePath, JSON.stringify(entrypoints, null, 2) + '\n')
}

function generateEntrypointsForProject(
  project: string,
  configReader: ConfigReader,
) {
  const discovery = configReader.readDiscovery(project)
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
