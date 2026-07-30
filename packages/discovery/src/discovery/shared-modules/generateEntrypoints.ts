import { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { fileExistsCaseSensitive } from '../../utils/fsLayer'
import type { ConfigReader } from '../config/ConfigReader'
import { type Entrypoint, EntrypointsFile } from '../config/StructureConfig'
import type { EntryParameters } from '../output/types'
import { mapToReferenceNodes } from '../utils/reachable'

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
      // EOA entrypoints must come from current initialAddresses (see the
      // generator), so legacy EOAs are garbage-collected
      .filter(([addr, v]) => !(addr in generated) && v.type === 'Contract')
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

export function generateEntrypointsForProject(
  project: string,
  configReader: ConfigReader,
) {
  const discovery = configReader.readDiscovery(project)
  const initialAddresses = new Set(
    configReader.readConfig(project).structure.initialAddresses,
  )
  const leafAddresses = findLeafAddresses(discovery.entries)
  const entrypoints: Record<ChainSpecificAddress, Entrypoint> = {}
  discovery.entries.forEach((e) => {
    if (e.type === 'Reference') {
      return
    }
    // Discovered EOAs (e.g. multisig signers) can belong to many unrelated
    // projects, so an EOA may only become an entrypoint when it is
    // explicitly listed as an initial address. Anything else would merge
    // unrelated discoveries via cross-project references.
    if (e.type === 'EOA' && !initialAddresses.has(e.address)) {
      return
    }
    // Leaves (e.g. permissionless immutable verifiers) are dead ends that
    // many unrelated projects deploy or reuse. Referencing one pulls in the
    // whole referenced project, which would attribute this module's
    // infrastructure and permissions to a consumer that only calls the leaf.
    if (leafAddresses.has(e.address) && !initialAddresses.has(e.address)) {
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

// A leaf has no outgoing edges in the same graph that decides what a
// reference drags along: address values (including $admin/$implementation)
// plus issued permissions. Discovery relatives are deliberately not used,
// deployerAddress would make every deployed contract a non-leaf.
function findLeafAddresses(
  entries: EntryParameters[],
): Set<ChainSpecificAddress> {
  return new Set(
    mapToReferenceNodes(entries)
      .filter((node) => node.references.length === 0)
      .map((node) => node.address),
  )
}
