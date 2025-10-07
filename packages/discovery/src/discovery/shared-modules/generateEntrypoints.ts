import { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import type { ConfigReader } from '../config/ConfigReader'
import { type Entrypoint, EntrypointsFile } from '../config/StructureConfig'

const ENTRYPOINTS_FILENAME = 'entrypoints.json'

export function generateEntrypoints(
  project: string,
  existingFile: EntrypointsFile | undefined,
  generator: (project: string) => EntrypointsFile,
  logger: Logger = Logger.DEBUG,
  options = { updateOnly: false, keepLegacy: true },
): EntrypointsFile | undefined {
  if (options.updateOnly && !existingFile) {
    logger.info("Skipping update of entrypoints.json (file doesn't exist).")
    return
  }
  logger.info(`Generating entrypoints.json for project ${project}`)
  const entrypoints = generator(project)

  if (options.keepLegacy && existingFile) {
    logger.info('(keeping legacy entrypoints)')
    const generated = entrypoints.entrypoints ?? []
    const legacyEntries = Object.entries(existingFile.entrypoints ?? [])
      .filter(([addr, _]) => !(addr in generated))
      .map(([addr, v]) => [addr, { ...v, isLegacy: true }])
    entrypoints.entrypoints = {
      ...entrypoints.entrypoints,
      ...Object.fromEntries(legacyEntries),
    }
  }
  return entrypoints
}

export async function generateEntrypointsCommand(
  configReader: ConfigReader,
  project: string,
  logger: Logger = Logger.DEBUG,
  options = { updateOnly: false, keepLegacy: true },
) {
  const projectDir = configReader.getProjectPath(project)
  const outputFilePath = join(projectDir, ENTRYPOINTS_FILENAME)
  const existingFile = fileExistsCaseSensitive(outputFilePath)
    ? EntrypointsFile.parse(JSON.parse(readFileSync(outputFilePath, 'utf-8')))
    : undefined

  const generator = (project: string) =>
    generateEntrypointsForProject(project, configReader)

  const entrypoints = generateEntrypoints(
    project,
    existingFile,
    generator,
    logger,
    options,
  )
  if (entrypoints) {
    await writeFile(outputFilePath, JSON.stringify(entrypoints, null, 2) + '\n')
  }
}

function generateEntrypointsForProject(
  project: string,
  configReader: ConfigReader,
) {
  const discovery = configReader.readDiscovery(project)
  const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {}
  discovery.entries.forEach((e) => {
    if (e.type === 'Reference') {
      return
    }
    entrypoints[e.address] = {
      ...(e.name && { name: e.name }),
      type: e.type,
      project,
    }
  })

  return { entrypoints }
}
